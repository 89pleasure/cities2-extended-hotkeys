# ExtendedHotkeys for Cities Skylines II

Extends the default hotkeys of Cities Skylines II with some useful ones.
For now you can't set them yourself. But this will be added later as a feature.

## Updates
- v0.5.0
	- Added brush wheel for terrain tools @fenrir200678
	- Updated UI for reverse scroll options
 - Removed anarchy hotkey due to mod replacement
- v0.4.0
	-Added wheel reverse options for net tool and elevation wheel
	- Mouse right-click no longer aborts net tool placement while in elevation wheel mode
- v0.3.0
	- Added replace/upgrade tool to net tool wheel
- v0.2.3
	- Fixed camera movement issue
	- Added missing HookUI dependency
- v0.2.2
	- Fixed wrong hotkeys for net tool wheel and anarchy mode
- v0.2.1
	- Fixed wrong languages
- v0.2.0
	- New Feature: Mouse wheels
		- Net Tool Mouse Wheel: Change net tool mode (straight, curve, complex curve, continious, grid)
		- Elevation Mouse Wheel: Change elevation (up, down)
	- New Hotkey:
		- Anarchy Mode (ALT-A): Toggle anarchy mode on/off
- v0.1.0
	- Initial release

## Mouse Wheels
- **NetTool Mode Wheel**
	- CTRL+Scroll: Change net tool mode (straight, curve, complex curve, continious, grid)
	- Upgrade tool is going to be added soon (technically not a NetTool)
- **Elevation Wheel**
	- ALT+Scroll: Change elevation (up, down)

## Hotkeys

### Net Tool
- CTRL + Q: Set net tool to straight mode
- CTRL + W: Set net tool to curve mode
- CTRL + E: Set net tool to complex curve mode
- CTRL + R: Set net tool to continious mode
- CTRL + T: Set net tool to grid mode
- POS1: Reset elevation to 0 (If dev mode is activated uses END key instead)

## In Development
- Customizable Hotkeys
- Brush Wheel for Terrain Tools and Tree Tools
- Rotation Wheel for Prop Tools and Building Tools

## Requirements
- Cities Skylines II
- Installed BepInEx 5.x or 6.x

## Installation
Simply download the latest release for the fitting BepInEx version from the [releases page](https://github.com/89pleasure/cities2-extended-hotkeys/releases)
and extract it to your `Cities Skylines II /bepinex/plugins` folder.

## Community
If you need any help or are you interested in modding yourself?
Join our discord community: [https://discord.gg/M9rgRtGcRa](https://discord.gg/M9rgRtGcRa)

## Compile
1. Create a copy of GlobalProperties.props.dist
2. Rename it to GlobalProperties.props										
3. Change path to your Cities Skylines II game folder
4. Choose the correct BepInEx version
5. It copies the dll to your BepInEx plugins folder automatically

## Credits
- Thanks to **@Fenrir200678** for his contribution to the mod
- Thanks **@optimus-code** for his C# knowledge and help
- Thanks to **captain_on_coit** for HookUI and help with JSX and React
- Thanks to **Bruceyboy24804** for testing and feedback