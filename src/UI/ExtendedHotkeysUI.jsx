import React from 'react'
import { useDataUpdate } from 'hookui-framework'
import * as styles from './styles'
import './style.css'

const ButtonDropdown = ({ selected, options, react }) => {
    const [isDropdownOpen, setDropdownOpen] = react.useState(false)

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen)
    }

    const handleItemClick = (item) => {
        // Handle the click on a dropdown item
        console.log(`Clicked on ${item}`)
        // You can perform additional actions based on the selected item
    }

    const dropdownStyle = { maskImage: 'url(Media/Glyphs/StrokeArrowDown.svg)' }
    const dropdownPopupStyle = { position: 'absolute', visibility: 'initial', left: '100%', top: '1091.000000px', maxHeight: '349.000000px', minWidth: '150.000000px' }

    return (
        <div className="field_Y9F undefined container_eL2">
            <div>
                <button className="dropdown-toggle_V9z dropdown-toggle_prl value-field_yJi value_PW_ dropdown_pJu item-states_QjV" onClick={toggleDropdown} style={{ minWidth: '110rem' }}>
                    <div className="label_l_4">{selected}</div>
                    <div className="tinted-icon_iKo indicator_Xmj" style={dropdownStyle}></div>
                </button>
                {isDropdownOpen && options && (
                    <div className="dropdown-popup_mMv" style={dropdownPopupStyle}>
                        <div className="scrollable_DXr y_SMM track-visible-y_RCA">
                            <div className="content_gqa">
                                {options.map((item) => (
                                    <button className="dropdown-item_sZT undefined" key={item} onClick={() => handleItemClick(item)}>{item}</button>
                                ))}
                            </div>

                        </div>
                        <div className="track_e3O y_SMM">
                            <div className="thumb_Cib y_SMM"></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

const $Panel = ({ title, children, react }) => {

    const [maxHeight, setMaxHeight] = react.useState(0)
    react.useEffect(() => {
        const calculateMaxHeight = () => {
            // Calculate 50% of the window height
            const windowHeight = window.innerHeight
            const newMaxHeight = windowHeight * 0.5

            // Set the state with the new maxHeight value
            setMaxHeight(newMaxHeight)
        }

        // Calculate initial maxHeight on mount
        calculateMaxHeight()

        // Add event listener to update maxHeight on window resize
        window.addEventListener('resize', calculateMaxHeight)

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('resize', calculateMaxHeight)
        }
    }, []) // Empty dependency array ensures the effect runs only once on mount

    const [position, setPosition] = react.useState({ top: 100, left: 10 })
    const [dragging, setDragging] = react.useState(false)
    const [rel, setRel] = react.useState({ x: 0, y: 0 }) // Position relative to the cursor
    const [topValue, setTopValue] = react.useState(0)
    const panelStyle = { position: 'absolute', maxHeight: maxHeight + 'rem' }

    const [version, setVersion] = react.useState(null)
    useDataUpdate(react, 'extendedHotkeys.version', setVersion)

    const onMouseDown = (e) => {
        if (e.button !== 0) return // Only left mouse button
        const panelElement = e.target.closest('.panel_YqS')

        // Calculate the initial relative position
        const rect = panelElement.getBoundingClientRect()
        setRel({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        })

        setDragging(true)
        e.stopPropagation()
        e.preventDefault()
    }

    const onMouseUp = () => {
        setDragging(false)
        // Remove window event listeners when the mouse is released
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('mouseup', onMouseUp)
    }

    const onMouseMove = (e) => {
        if (!dragging) return

        setPosition({
            top: e.clientY - rel.y,
            left: e.clientX - rel.x,
        })
        e.stopPropagation()
        e.preventDefault()
    }

    const onClose = () => {
        const data = { type: 'toggle_visibility', id: '89pleasure.extendedHotkeys' }
        const event = new CustomEvent('hookui', { detail: data })
        window.dispatchEvent(event)
    }

    const draggableStyle = {
        ...panelStyle,
        top: position.top + 'px',
        left: position.left + 'px'
    }

    const handleScroll = (event) => {
        setTopValue(event.target.scrollTop)
    }
    const scrollableStyle = { height: '200px', top: topValue }
    const closeStyle = { maskImage: 'url(Media/Glyphs/Close.svg)' }
    const versionString = 'v' + version

    react.useEffect(() => {
        if (dragging) {
            // Attach event listeners to window
            window.addEventListener('mousemove', onMouseMove)
            window.addEventListener('mouseup', onMouseUp)
        }

        return () => {
            // Clean up event listeners when the component unmounts or dragging is finished
            window.removeEventListener('mousemove', onMouseMove)
            window.removeEventListener('mouseup', onMouseUp)
        }
    }, [dragging]) // Only re-run the effect if dragging state changes

    return (
        <div className="panel_YqS active-infoview-panel_aTq" style={draggableStyle}>
            <div className="header_H_U header_Bpo child-opacity-transition_nkS" onMouseDown={onMouseDown}>
                <div className="title-bar_PF4 title_Hfc">
                    <div className="icon-space_h_f">
                        {version && <div style={{ fontSize: 'var(--fontSizeXS)', color: 'rgba(255, 255, 255, 0.5)' }}>{versionString}</div>}
                    </div>
                    <div className="title_SVH title_zQN">{title}</div>
                    <button className="button_bvQ button_bvQ close-button_wKK" onClick={onClose}>
                        <div className="tinted-icon_iKo icon_PhD" style={closeStyle}></div>
                    </button>
                </div>
            </div>
            <div className="content_XD5 content_AD7 child-opacity-transition_nkS content_BIL"
                style={{ height: { maxHeight } + 'rem', overflowY: 'scroll', flexDirection: 'column' }}>
                <div className="section_sop section_gUk statistics-menu_y86" style={{ width: '100%' }}>
                    <div className="content_flM content_owQ first_l25 last_ZNw">
                        <div className="scrollable_DXr y_SMM track-visible-y_RCA scrollable_By7">
                            <div className="content_gqa" onScroll={handleScroll}>
                                <div className="content_Q1O">
                                    {children}
                                </div>
                                <div className="bottom-padding_JS3"></div>
                            </div>
                            <div className="track_e3O y_SMM">
                                <div id="scrollbar" className="thumb_Cib y_SMM" style={scrollableStyle}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ExtendedHotkeysUI = ({ react }) => {

    // Translations
    const [translations, setTranslations] = react.useState({})
    useDataUpdate(react, 'extendedHotkeys.translations', setTranslations)

    // DISABLE MOD
    const [disableMod, setDisableMod] = react.useState(false)
    useDataUpdate(react, 'extendedHotkeys.disableMod', setDisableMod)

    const [enableNetToolWheel, setEnableNetToolWheel] = react.useState(true)
    useDataUpdate(react, 'extendedHotkeys.enableNetToolWheel', setEnableNetToolWheel)

    const [enableNetToolReverse, setEnableNetToolReverse] = react.useState(false)
    useDataUpdate(react, 'extendedHotkeys.enableNetToolReverse', setEnableNetToolReverse)

    const [enableElevationWheel, setEnableElevationWheel] = react.useState(true)
    useDataUpdate(react, 'extendedHotkeys.enableElevationWheel', setEnableElevationWheel)

    const [enableElevationReverse, setEnableElevationReverse] = react.useState(false)
    useDataUpdate(react, 'extendedHotkeys.enableElevationReverse', setEnableElevationReverse)

    const [enableBrushSizeWheel, setEnableBrushSizeWheel] = react.useState(true)
    useDataUpdate(react, 'extendedHotkeys.enableBrushSizeWheel', setEnableBrushSizeWheel)

    const [enableBrushSizeReverse, setEnableBrushSizeReverse] = react.useState(false)
    useDataUpdate(react, 'extendedHotkeys.enableBrushSizeReverse', setEnableBrushSizeReverse)

    const [enableBrushStrengthWheel, setEnableBrushStrengthWheel] = react.useState(true)
    useDataUpdate(react, 'extendedHotkeys.enableBrushStrengthWheel', setEnableBrushStrengthWheel)

    const [enableBrushStrengthReverse, setEnableBrushStrengthReverse] = react.useState(false)
    useDataUpdate(react, 'extendedHotkeys.enableBrushStrengthReverse', setEnableBrushStrengthReverse)

    const [expandReverseGroup, setExpandReverseGroup] = react.useState(false)
    useDataUpdate(react, 'extendedHotkeys.expandReverseGroup', setExpandReverseGroup);

    const [enableElevationReset, setEnableElevationReset] = react.useState(true)
    useDataUpdate(react, 'extendedHotkeys.enableElevationReset', setEnableElevationReset)

    const [enableElevationStepScroll, setEnableElevationStepScroll] = react.useState(true)
    useDataUpdate(react, 'extendedHotkeys.enableElevationStepScroll', setEnableElevationStepScroll)

    const [expandNTMGroup, setExpandNTMGroup] = react.useState(true)
    useDataUpdate(react, 'extendedHotkeys.expandNTMGroup', setExpandNTMGroup)

    const [enableNTMGroup, setEnableNTMGroup] = react.useState(true)
    useDataUpdate(react, 'extendedHotkeys.enableNTMGroup', setEnableNTMGroup)

    const [enableNTMStraight, setEnableNTMStraight] = react.useState(true)
    useDataUpdate(react, 'extendedHotkeys.enableNTMStraight', setEnableNTMStraight)

    const [enableNTMSimpleCurve, setEnableNTMSimpleCurve] = react.useState(true)
    useDataUpdate(react, 'extendedHotkeys.enableNTMSimpleCurve', setEnableNTMSimpleCurve)

    const [enableNTMComplexCurve, setEnableNTMComplexCurve] = react.useState(true)
    useDataUpdate(react, 'extendedHotkeys.enableNTMComplexCurve', setEnableNTMComplexCurve)

    const [enableNTMContinuous, setEnableNTMContinuous] = react.useState(true)
    useDataUpdate(react, 'extendedHotkeys.enableNTMContinuous', setEnableNTMContinuous)

    const [enableNTMGrid, setEnableNTMGrid] = react.useState(true)
    useDataUpdate(react, 'extendedHotkeys.enableNTMGrid', setEnableNTMGrid)

    const generalSettingsData = [
        { id: 0, label: translations['disableMod'], description: translations['disableMod.description'], isChecked: disableMod },
    ]

    const mouseWheelSettingsData = [
        {
            id: 1, label: translations['netToolModeWheel'], description: translations['netToolModeWheel.description'], isChecked: enableNetToolWheel, keyCode: 1
        },
        {
            id: 2, label: translations['elevationWheel'], description: translations['elevationWheel.description'], isChecked: enableElevationWheel, keyCode: 2
        },
        {
            id: 15, label: translations['brushSize'], description: translations['brushSize.description'], isChecked: enableBrushSizeWheel, keyCode: 1
        },
        {
            id: 16, label: translations['brushStrength'], description: translations['brushStrength.description'], isChecked: enableBrushStrengthWheel, keyCode: 2
        },
        {
            id: 19, label: translations['reverseScroll'], description: translations['reverseScroll.description'], expanded: expandReverseGroup, children:
                [
                    { id: 13, label: translations['netToolModeWheel'], isChecked: enableNetToolReverse },
                    { id: 14, label: translations['elevationWheel'], isChecked: enableElevationReverse },
                    { id: 17, label: translations['brushSize'], isChecked: enableBrushSizeReverse },
                    { id: 18, label: translations['brushStrength'], isChecked: enableBrushStrengthReverse },
                ]
        }
    ]

    const staticHotkeysSettingsData = [
        {
            id: 4, label: translations['elevationReset'], description: translations['elevationReset.description'], isChecked: enableElevationReset, hotkey: 'POS1/END'
        },
        {
            id: 12, label: translations['elevationStepScroll'], description: translations['elevationStepScroll.description'], isChecked: enableElevationStepScroll, hotkey: 'ALT + Mouse-Click-R'
        },
        {
            id: 5, label: translations['netToolModes'], description: translations['netToolModes.description'], expanded: expandNTMGroup, isChecked: enableNTMGroup, children: [
                { id: 6, label: translations['netToolModes.straight'], isChecked: enableNTMStraight, hotkey: 'CTRL + Q' },
                { id: 7, label: translations['netToolModes.curve'], isChecked: enableNTMSimpleCurve, hotkey: 'CTRL + W' },
                { id: 8, label: translations['netToolModes.complexCurve'], isChecked: enableNTMComplexCurve, hotkey: 'CTRL + E' },
                { id: 9, label: translations['netToolModes.continuous'], isChecked: enableNTMContinuous, hotkey: 'CTRL + R' },
                { id: 10, label: translations['netToolModes.grid'], isChecked: enableNTMGrid, hotkey: 'CTRL + T' },
            ]
        },
    ]

    const Setting = ({ setting, nested }) => {
        const { label, isChecked, description, expanded, hotkey, keyCode, children } = setting
        const checked_class = isChecked ? styles.CLASS_CHECKED : styles.CLASS_UNCHECKED

        const onToggle = () => {
            engine.trigger('extendedHotkeys.onToggle', setting.id)
        }

        const onExpand = () => {
            engine.trigger('extendedHotkeys.onExpand', setting.id)
        }

        // Available mouse wheel key codes

        const onExpandAction = children && children.length > 0 ? onExpand : null
        const nestingStyle = { '--nesting': nested }
        const headerContentStyle = { marginTop: '-1rem' }
        const keyCodeStyle = { fontSize: 'var(--fontSizeS)', fontWeight: 'normal', textAlign: 'right', paddingRight: '10rem' }
        const descriptionStyle = { fontSize: 'var(--fontSizeXS)' }
        const borderColor = isChecked ? 'rgba(134, 205, 144, 1.000000)' : 'rgba(134, 205, 144, 0.250000)'
        const borderStyle = {
            borderTopColor: borderColor,
            borderLeftColor: borderColor,
            borderRightColor: borderColor,
            borderBottomColor: borderColor
        }

        const maskImageStyle = { maskImage: expanded === false ? 'url(Media/Glyphs/ThickStrokeArrowRight.svg)' : 'url(Media/Glyphs/ThickStrokeArrowDown.svg)' }
        const renderChildren = () => {
            if (children && children.length > 0 && expanded) {
                return (
                    <div className="content_mJm foldout-expanded">
                        {children.map((child) => (
                            <Setting key={child.id} setting={child} onToggle={onToggle} nested={nested + 1} />
                        ))}
                    </div>
                )
            }

            return null
        }

        const renderWheelKeyCodes = () => {
            if (keyCode !== undefined) {
                const availableWheelKeyCodes = ['SHIFT', 'CTRL', 'ALT']
                const label = availableWheelKeyCodes[keyCode] + ' + Scroll'
                return (
                    <div className={styles.CLASS_TT_HEADER_CONTENT} style={keyCodeStyle}>
                        <div className={styles.CLASS_TT_LABEL}>{label}</div>
                    </div>
                )
            }

            return null
        }

        const renderHotkeys = () => {
            if (hotkey) {
                return (
                    <div className={styles.CLASS_TT_HEADER_CONTENT} style={keyCodeStyle}>
                        <div className={styles.CLASS_TT_LABEL}>{hotkey}</div>
                    </div>
                )
            }

            return null
        }

        return (
            <div className={styles.many(styles.CLASS_TT_FOLDOUT, styles.CLASS_TT_DISABLE_MOUSE_STATES)} style={nestingStyle}>
                <div className={styles.many(styles.CLASS_TT_HEADER, styles.CLASS_TT_ITEMMOUSESTATES, styles.CLASS_TT_ITEM_FOCUSED)}>
                    {isChecked != undefined && <div className={styles.CLASS_TT_ICON} onClick={onToggle}>
                        <div className={styles.many(styles.CLASS_TT_CHILD_TOGGLE, styles.CLASS_TT_ITEMMOUSESTATES, checked_class)} style={borderStyle}>
                            <div className={styles.many(styles.CLASS_TT_CHECKMARK, checked_class)}></div>
                        </div>
                    </div>
                    }
                    <div className={styles.CLASS_TT_HEADER_CONTENT} style={headerContentStyle} onClick={onExpandAction}>
                        <div className={styles.CLASS_TT_LABEL}>{label}</div>
                        {description && <div style={descriptionStyle}>{description}</div>}
                    </div>
                    {renderWheelKeyCodes()}
                    {renderHotkeys()}
                    {children && children.length > 0 && <div className="tinted-icon_iKo toggle_RV4 toggle_yQv" style={maskImageStyle} onClick={onExpandAction}></div>}
                </div>
                {renderChildren()}
            </div>
        )
    }

    const SettingsList = ({ name, description, settings }) => {
        const descriptionStyle = {
            fontSize: 'var(--fontSizeS)',
            fontWeight: 'normal',
        }

        return (
            <div className="statistics-category-item_qVI">
                <div className="header_Ld7">{name}</div>
                {description && <div className={styles.CLASS_TT_HEADER} style={descriptionStyle}>{description}</div>}
                <div className="items_AIY">
                    {settings.map((setting) => (
                        <Setting
                            key={setting.id}
                            nested={0}
                            setting={setting}
                        />
                    ))}
                </div>
            </div>
        )
    }

    return <$Panel title="Extended Hotkeys" react={react}>
        <SettingsList name="General" settings={generalSettingsData} />
        <SettingsList name="Mouse Wheel" description="Extended actions with your mouse wheel while in net tool placing roads." settings={mouseWheelSettingsData} />
        <SettingsList name="Hotkeys" description="Awesome actions with your keyboard." settings={staticHotkeysSettingsData} />
    </$Panel>
}

window._$hookui.registerPanel({
    id: '89pleasure.extendedHotkeys',
    name: 'ExtendedHotkeys',
    icon: 'Media/Game/Icons/Journal.svg',
    component: ExtendedHotkeysUI
})