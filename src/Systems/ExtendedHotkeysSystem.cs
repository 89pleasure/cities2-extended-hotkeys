using ExtendedHotkeys.Settings;
using ExtendedHotkeys.Wheels;
using Game;
using Game.Audio;
using Game.Input;
using Game.Prefabs;
using Game.SceneFlow;
using Game.Tools;
using Game.UI.InGame;
using System;
using System.Collections.Generic;
using System.Linq;
using Unity.Entities;
using UnityEngine;
using UnityEngine.InputSystem;
using UnityEngine.Scripting;
using Debug = UnityEngine.Debug;


namespace ExtendedHotkeys.Systems
{
    class ExtendedHotkeysSystem : GameSystemBase
    {
        private GameScreenUISystem m_GameScreenUISystem;
        private ToolSystem m_ToolSystem;
        private NetToolSystem m_NetToolSystem;
        private TerrainToolSystem m_TerrainToolSystem;
        private ToolUXSoundSettingsData m_SoundData;

        private readonly List<WheelBase> m_Wheels = [];
        private CameraController m_CameraController;

        public LocalSettings m_LocalSettings;
        private LocalSettingsItem m_Settings;

        private bool m_LocalSettingsLoaded;
        public bool hotkeyPressed = false;

        private WheelBase ActiveWheel => m_Wheels.Find((WheelBase wheel) => wheel.IsActive);
        private bool IsAnyWheelActive => m_Wheels.Any((WheelBase wheel) => wheel.IsActive);

        // Available KeyCodes a user can choose for hotkeys
        public List<KeyCode> availableKeyCodes =
        [
            KeyCode.LeftShift,
            KeyCode.LeftControl,
            KeyCode.LeftAlt,
            KeyCode.RightShift,
            KeyCode.RightControl,
            KeyCode.RightAlt,
            KeyCode.Space
        ];

        [Preserve]
        public ExtendedHotkeysSystem()
        {
        }

        [Preserve]
        protected override void OnCreate()
        {
            base.OnCreate();
            LoadSettings();
            
            m_ToolSystem = World.GetOrCreateSystemManaged<ToolSystem>();
            m_NetToolSystem = World.GetExistingSystemManaged<NetToolSystem>();
            m_TerrainToolSystem = World.GetExistingSystemManaged<TerrainToolSystem>();
            World.GetOrCreateSystemManaged<ExtendedHotKeysTranslationSystem>();
            m_GameScreenUISystem = World.GetExistingSystemManaged<GameScreenUISystem>();
            EntityQuery soundQuery = GetEntityQuery(ComponentType.ReadOnly<ToolUXSoundSettingsData>());

            // Add hotkeys
            CreateNetToolBindings();
            CreateOpenToolWindowBindings();

            // Add mouse wheels
            m_Wheels.Add(new NetToolWheel(m_ToolSystem, m_NetToolSystem, soundQuery, m_Settings));
            m_Wheels.Add(new ElevationToolWheel(m_ToolSystem, m_NetToolSystem, soundQuery, m_Settings));
            m_Wheels.Add(new TerrainToolBrushSizeWheel(m_ToolSystem, m_TerrainToolSystem, soundQuery, m_Settings));
            m_Wheels.Add(new TerrainToolBrushStrengthWheel(m_ToolSystem, m_TerrainToolSystem, soundQuery, m_Settings));

            Debug.Log($"[{MyPluginInfo.PLUGIN_NAME}] System created!");
        }

        [Preserve]
        protected override void OnUpdate()
        {
            if (!m_LocalSettingsLoaded)
                return;

            if (m_CameraController == null && CameraController.TryGet(out CameraController cameraController))
            {
                m_CameraController = cameraController;
            }

            if (m_ToolSystem != null && m_CameraController != null && InputManager.instance.mouseOnScreen)
            {
                foreach (WheelBase wheel in m_Wheels)
                {
                    wheel.HandleAction();
                }
            }

            m_CameraController.inputEnabled = !IsAnyWheelActive;
        }

        private void CreateCameraMoveReplacement()
        {
        }

        private void CreateNetToolBindings()
        {
            string binding = "<Keyboard>/home";
            bool developerMode = GameManager.instance.configuration.developerMode;

            if (developerMode)
            {
                Debug.Log("Developer mode is enabled. Set binding to END instead.");
                binding = "<Keyboard>/end";
            }

            AddBinding(name: "ResetElevationToZero", binding: binding, callback: OnResetElevation);
            AddCombinedBinding(name: "SetStraight", modifier: "<keyboard>/ctrl", binding: "<Keyboard>/q", callback: (_) => OnSetNetToolSystemMode(_, NetToolSystem.Mode.Straight));
            AddCombinedBinding(name: "SetCurveTool", modifier: "<keyboard>/ctrl", binding: "<Keyboard>/w", callback: (_) => OnSetNetToolSystemMode(_, NetToolSystem.Mode.SimpleCurve));
            AddCombinedBinding(name: "SetAdvCurveTool", modifier: "<keyboard>/ctrl", binding: "<Keyboard>/e", callback: (_) => OnSetNetToolSystemMode(_, NetToolSystem.Mode.ComplexCurve));
            AddCombinedBinding(name: "SetContinuousMode", modifier: "<keyboard>/ctrl", binding: "<Keyboard>/r", callback: (_) => OnSetNetToolSystemMode(_, NetToolSystem.Mode.Continuous));
            AddCombinedBinding(name: "SetGridMode", modifier: "<keyboard>/ctrl", binding: "<Keyboard>/t", callback: (_) => OnSetNetToolSystemMode(_, NetToolSystem.Mode.Grid));

            // Add bindings for elevation tool ALT + Right Mouse
            AddCombinedBinding(name: "UpdateElevationStep", modifier: "<keyboard>/leftAlt", binding: "<mouse>/rightButton", callback: OnElevationScroll);

            // Add binding for anarchy mode ALT + A
            AddCombinedBinding(name: "EnableAnarchyMode", modifier: "<keyboard>/leftAlt", binding: "<keyboard>/a", callback: EnableAnarchyModeAction);
        }

        private void CreateOpenToolWindowBindings()
        {
            // TODO: Add support for custom key bindings from user selection and probably get the entities the proper way
            // For now, we'll just use e,r & t to open the most used tool windows that are available at the start of the game
            AddBinding("OpenZoning", binding: "<Keyboard>/e", callback: (_) => OnOpenToolWindow(_, "zoning"));
            AddBinding("OpenRoads", binding: "<Keyboard>/r", callback: (_) => OnOpenToolWindow(_, "roads"));
            AddBinding("OpenTerrain", binding: "<Keyboard>/t", callback: (_) => OnOpenToolWindow(_, "terrain"));
            /*
            AddCombinedBinding("OpenPower", modifier: "<keyboard>/ctrl", binding: "<Keyboard>/4", callback: (_) => OnOpenToolWindow(_, "power"));
            AddCombinedBinding("OpenWater", modifier: "<keyboard>/ctrl", binding: "<Keyboard>/5", callback: (_) => OnOpenToolWindow(_, "water"));
            AddCombinedBinding("OpenAreas", modifier: "<keyboard>/ctrl", binding: "TODO", callback: (_) => OnOpenToolWindow(_, "areas"));
            AddCombinedBinding("OpenSpecialBuildings", modifier:"<keyboard>/ctrl", binding: "TODO", callback: (_) => OnOpenToolWindow(_, "specialBuildings"));
            AddCombinedBinding("OpenHealthcare", modifier:"<keyboard>/ctrl", binding: "TODO", callback: (_) => OnOpenToolWindow(_, "healthcare"));
            AddCombinedBinding("OpenGarbage", modifier:"<keyboard>/ctrl", binding: "TODO", callback: (_) => OnOpenToolWindow(_, "garbage"));
            AddCombinedBinding("OpenEducation", modifier:"<keyboard>/ctrl", binding: "TODO", callback: (_) => OnOpenToolWindow(_, "education"));
            AddCombinedBinding("OpenFireDepartment", modifier:"<keyboard>/ctrl", binding: "TODO", callback: (_) => OnOpenToolWindow(_, "fireDepartment"));
            AddCombinedBinding("OpenPoliceDepartment", modifier:"<keyboard>/ctrl", binding: "TODO", callback: (_) => OnOpenToolWindow(_, "policeDepartment"));
            AddCombinedBinding("OpenPublicTransport", modifier:"<keyboard>/ctrl", binding: "TODO", callback: (_) => OnOpenToolWindow(_, "publicTransport"));
            AddCombinedBinding("OpenParks", modifier:"<keyboard>/ctrl", binding: "TODO", callback: (_) => OnOpenToolWindow(_, "parks"));
            AddCombinedBinding("OpenCommunication", modifier:"<keyboard>/ctrl", binding: "TODO", callback: (_) => OnOpenToolWindow(_, "communication"));
            */
        }

        private static object GetEntityPayload(string menuName)
        {
            return new
            {
                __Type = "Unity.Entities.Entity",
                index = GetEntityIndex(menuName),
                version = 1
            };
        }

        private static int GetEntityIndex(string menuName)
        {
            return menuName switch
            {
                "zoning" => 16944,
                "areas" => 34467,
                "specialBuildings" => 16993,
                "roads" => 16941,
                "power" => 16934,
                "water" => 16943,
                "healthcare" => 16937,
                "garbage" => 16936,
                "education" => 16933,
                "fireDepartment" => 16935,
                "policeDepartment" => 16940,
                "publicTransport" => 16942,
                "parks" => 16939,
                "communication" => 16932,
                "terrain" => 16938,
                _ => 1
            };
        }

        private void LoadSettings()
        {
            try
            {
                m_LocalSettings = new LocalSettings();
                m_LocalSettings.Init();
                m_LocalSettingsLoaded = true;
                m_Settings = m_LocalSettings.Settings;
            }
            catch (Exception e)
            {
                Debug.Log($"Error loading settings: {e.Message}");
            }
        }

        private void OnOpenToolWindow(InputAction.CallbackContext _, string menuName)
        {
            cohtml.Net.View ui = GameManager.instance.userInterface.view.View;
            bool isInPauseMenu = m_GameScreenUISystem.isMenuActive;
            
            if (isInPauseMenu)
            {
                Debug.Log($"[{MyPluginInfo.PLUGIN_NAME}]: Pause menu is active. Not opening tool window.");
                return;
            }

            object selectedMenu = GetEntityPayload(menuName);
            ui.TriggerEvent("toolbar.selectAssetMenu", selectedMenu);
        }

        private void OnSetNetToolSystemMode(InputAction.CallbackContext _, NetToolSystem.Mode mode)
        {
            if (!m_Settings.EnableNTMGroup || m_ToolSystem.activeTool is not NetToolSystem)
                return;

            if (mode == NetToolSystem.Mode.Straight && !m_Settings.EnableNTMStraight)
                return;

            if (mode == NetToolSystem.Mode.SimpleCurve && !m_Settings.EnableNTMSimpleCurve)
                return;

            if (mode == NetToolSystem.Mode.ComplexCurve && !m_Settings.EnableNTMComplexCurve)
                return;

            if (mode == NetToolSystem.Mode.Continuous && !m_Settings.EnableNTMContinuous)
                return;

            if (mode == NetToolSystem.Mode.Grid && !m_Settings.EnableNTMGrid)
                return;

            m_NetToolSystem.mode = mode;
            cohtml.Net.View ui = GameManager.instance.userInterface.view.View;
            ui.TriggerEvent("tool.selectToolMode", (int)mode);

            AudioManager.instance.PlayUISound(m_SoundData.m_NetStartSound);
        }

        private void OnResetElevation(InputAction.CallbackContext _)
        {
            if (!m_Settings.EnableElevationReset || m_ToolSystem.activeTool is not NetToolSystem)
                return;

            World.GetOrCreateSystemManaged<NetToolSystem>().elevation = 0f;

            EntityQuery uxSoundQuery = GetEntityQuery(ComponentType.ReadOnly<ToolUXSoundSettingsData>());
            ToolUXSoundSettingsData soundSettingsData = uxSoundQuery.GetSingleton<ToolUXSoundSettingsData>();
            AudioManager.instance.PlayUISound(soundSettingsData.m_NetStartSound, 0.5f);
        }

        private void EnableAnarchyModeAction(InputAction.CallbackContext _)
        {
            if (!m_Settings.EnableAnarchyMode)
                return;

            m_ToolSystem.ignoreErrors = !m_ToolSystem.ignoreErrors;

            EntityQuery uxSoundQuery = GetEntityQuery(ComponentType.ReadOnly<ToolUXSoundSettingsData>());
            ToolUXSoundSettingsData soundSettingsData = uxSoundQuery.GetSingleton<ToolUXSoundSettingsData>();
            AudioManager.instance.PlayUISound(soundSettingsData.m_AreaMarqueeEndSound, 0.5f);
        }

        private void OnElevationScroll(InputAction.CallbackContext _)
        {
            if (!m_Settings.EnableElevationStepScroll || m_ToolSystem.activeTool is not NetToolSystem || InputManager.instance.mouseOverUI)
                return;

            float newElevation = m_NetToolSystem.elevationStep / 2.0f;
            newElevation = newElevation < 1.25f ? 10f : newElevation;

            cohtml.Net.View ui = GameManager.instance.userInterface.view.View;
            ui.TriggerEvent("tool.setElevationStep", newElevation);

            EntityQuery uxSoundQuery = GetEntityQuery(ComponentType.ReadOnly<ToolUXSoundSettingsData>());
            ToolUXSoundSettingsData soundSettingsData = uxSoundQuery.GetSingleton<ToolUXSoundSettingsData>();
            AudioManager.instance.PlayUISound(soundSettingsData.m_NetStartSound, 0.5f);
        }

        private static void AddBinding(string name, string binding, Action<InputAction.CallbackContext> callback)
        {
            InputAction customInputAction = new(name: name, binding: binding);
            customInputAction.performed += callback;
            customInputAction.Enable();

            Debug.Log($"[{MyPluginInfo.PLUGIN_NAME}]: Added binding " + name + " with key " + binding);
        }

        private static void AddCombinedBinding(string name, string binding, string modifier, Action<InputAction.CallbackContext> callback)
        {
            InputAction customInputAction = new(name);
            customInputAction.AddCompositeBinding("ButtonWithOneModifier")
                .With("Modifier", modifier)
                .With("Button", binding);
            customInputAction.performed += callback;
            customInputAction.Enable();
            Debug.Log($"[{MyPluginInfo.PLUGIN_NAME}]: Added binding " + name + " with key combo " + modifier + " + " + binding);
        }
    }
}