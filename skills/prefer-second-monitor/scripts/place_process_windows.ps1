[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [ValidateRange(1, 2147483647)]
    [int]$TargetProcessId,

    [string]$DeviceName,

    [switch]$Apply
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version 2.0

Add-Type -AssemblyName System.Windows.Forms
if (-not ('SecondMonitorPlacement.NativeWindow' -as [type])) {
    Add-Type -TypeDefinition @'
using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;

namespace SecondMonitorPlacement {
    public static class NativeWindow {
        private delegate bool EnumWindowsProc(IntPtr hwnd, IntPtr lParam);

        [DllImport("user32.dll")]
        private static extern bool EnumWindows(EnumWindowsProc callback, IntPtr lParam);

        [DllImport("user32.dll")]
        private static extern uint GetWindowThreadProcessId(IntPtr hwnd, out uint processId);

        [DllImport("user32.dll")]
        private static extern bool IsWindowVisible(IntPtr hwnd);

        [DllImport("user32.dll", SetLastError = true)]
        private static extern bool SetWindowPos(
            IntPtr hwnd, IntPtr insertAfter, int x, int y, int cx, int cy, uint flags);

        private const uint SWP_NOSIZE = 0x0001;
        private const uint SWP_NOZORDER = 0x0004;
        private const uint SWP_NOACTIVATE = 0x0010;

        public static IntPtr[] VisibleWindowsForProcess(uint targetProcessId) {
            var windows = new List<IntPtr>();
            EnumWindows((hwnd, _) => {
                uint processId;
                GetWindowThreadProcessId(hwnd, out processId);
                if (processId == targetProcessId && IsWindowVisible(hwnd)) {
                    windows.Add(hwnd);
                }
                return true;
            }, IntPtr.Zero);
            return windows.ToArray();
        }

        public static bool MoveWithoutActivation(IntPtr hwnd, int x, int y) {
            return SetWindowPos(
                hwnd, IntPtr.Zero, x, y, 0, 0,
                SWP_NOSIZE | SWP_NOZORDER | SWP_NOACTIVATE);
        }
    }
}
'@
}

$process = Get-Process -Id $TargetProcessId -ErrorAction Stop
$screens = @([System.Windows.Forms.Screen]::AllScreens | Sort-Object DeviceName)
if ($screens.Count -lt 2) {
    [pscustomobject]@{
        process_id = $TargetProcessId
        process_name = $process.ProcessName
        status = 'single_monitor_noop'
        applied = $false
        window_count = 0
    } | ConvertTo-Json -Depth 4
    exit 0
}

$target = if (-not [string]::IsNullOrWhiteSpace($DeviceName)) {
    $screens | Where-Object DeviceName -EQ $DeviceName | Select-Object -First 1
} else {
    $screens | Where-Object { -not $_.Primary } | Select-Object -First 1
}
if ($null -eq $target) {
    throw 'The requested secondary display was not found.'
}

$work = $target.WorkingArea
$windows = @([SecondMonitorPlacement.NativeWindow]::VisibleWindowsForProcess([uint32]$TargetProcessId))
$placements = @()
for ($index = 0; $index -lt $windows.Count; $index++) {
    $x = $work.Left + 24 + (($index % 3) * 36)
    $y = $work.Top + 24 + (($index % 3) * 36)
    $moved = $false
    if ($Apply) {
        $moved = [SecondMonitorPlacement.NativeWindow]::MoveWithoutActivation($windows[$index], $x, $y)
        if (-not $moved) { throw 'SetWindowPos failed for one task-owned window.' }
    }
    $placements += [pscustomobject]@{
        handle = ('0x{0:X}' -f $windows[$index].ToInt64())
        x = $x
        y = $y
        moved = $moved
    }
}

[pscustomobject]@{
    process_id = $TargetProcessId
    process_name = $process.ProcessName
    status = $(if ($Apply) { 'applied' } else { 'dry_run' })
    applied = [bool]$Apply
    target = [pscustomobject]@{
        device_name = $target.DeviceName
        primary = $target.Primary
        working_area = [pscustomobject]@{
            left = $work.Left
            top = $work.Top
            width = $work.Width
            height = $work.Height
        }
    }
    window_count = $windows.Count
    placements = $placements
} | ConvertTo-Json -Depth 6
