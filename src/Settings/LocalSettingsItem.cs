using UnityEngine;

namespace ExtendedHotkeys.Settings
{
    public class LocalSettingsItem
    {

        public string Version { get; } = MyPluginInfo.PLUGIN_VERSION;

        // GENERAL
        public bool DisableMod { get; set; } = false;
        public bool EnableNetToolWheel { get; set; } = true;
        public bool EnableNetToolReverse { get; set; } = true;
        public bool EnableElevationWheel { get; set; } = true;
        public bool EnableElevationReverse { get; set; } = true;
        public bool EnableBrushStrengthWheel { get; set; } = true;
        public bool EnableBrushStrengthReverse { get; set; } = true;
        public bool EnableBrushSizeWheel { get; set; } = true;
        public bool EnableBrushSizeReverse { get; set; } = true;
        public bool EnableNetToolHotkeys { get; set; } = true;
        public bool EnableSnappingWheel { get; set; } = true;
        public bool EnableElevationReset { get; set; } = true;
        public bool EnableElevationStepScroll { get; set; } = true;
        public bool ExpandReverseGroup { get; set; } = false;
        public bool ExpandNTMGroup { get; set; } = false;
        public bool EnableNTMGroup { get; set; } = true;
        public bool EnableNTMStraight { get; set; } = true;
        public bool EnableNTMSimpleCurve { get; set; } = true;
        public bool EnableNTMComplexCurve { get; set; } = true;
        public bool EnableNTMContinuous { get; set; } = true;
        public bool EnableNTMGrid { get; set; } = true;
        public KeyCode NetToolKeyCode { get; set; } = KeyCode.LeftControl;
        public KeyCode SnappingKeyCode { get; set; } = KeyCode.LeftShift;
        public KeyCode ElevationKeyCode { get; set; } = KeyCode.LeftAlt;
    }
}