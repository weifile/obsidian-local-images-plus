import {
    App,
    PluginSettingTab,
    Setting,
} from "obsidian"

import {
    displayError,
    logError,
    trimAny
} from "./utils"

import {
    APP_TITLE,
    setDebug,
    VERBOSE
} from "./config"

import LocalImagesPlugin from "./main"
import { t } from "./lang"
import safeRegex from "safe-regex"




export default class SettingTab extends PluginSettingTab {
    plugin: LocalImagesPlugin

    constructor(app: App, plugin: LocalImagesPlugin) {
        super(app, plugin)
        this.plugin = plugin
    }

    displSw(cont: any): void {
        cont.findAll(".setting-item").forEach((el: any) => {
            if (el.getAttr("class").includes("media_folder_set")) {

                if (this.plugin.settings.saveAttE === "obsFolder" ||
                    this.plugin.settings.saveAttE === "nextToNote") {
                    el.hide()
                }
                else {
                    el.show()
                }
            }
        })
    }

    display(): void {
        let { containerEl } = this



        containerEl.empty()


        containerEl.createEl("h1", { text: APP_TITLE })

        const donheader = containerEl.createEl("div")
        // donheader.createEl("a", { text: "Support the project! ", href: "https://www.buymeacoffee.com/sergeikorneev", cls: "donheader_txt" })

        containerEl.createEl("h3", { text: t("H_INTERFACE") })

        new Setting(containerEl)
            .setName(t("S_SHOW_NOTIF"))
            .setDesc(t("S_SHOW_NOTIF_D"))
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.showNotifications)
                    .onChange(async (value) => {
                        this.plugin.settings.showNotifications = value
                        await this.plugin.saveSettings()
                    })
            )

        new Setting(containerEl)
            .setName(t("S_DIS_ADD_COM"))
            .setDesc(t("S_DIS_ADD_COM_D"))
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.disAddCom)
                    .onChange(async (value) => {
                        this.plugin.settings.disAddCom = value
                        await this.plugin.saveSettings()
                    })
            )

        containerEl.createEl("h3", { text: t("H_PROCESSING") })



        new Setting(containerEl)
            .setName(t("S_AUTO"))
            .setDesc(t("S_AUTO_D"))

            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.realTimeUpdate)
                    .onChange(async (value) => {
                        this.plugin.settings.realTimeUpdate = value
                        await this.plugin.saveSettings()
                        this.plugin.setupQueueInterval()
                    })
            )

        new Setting(containerEl)
            .setName(t("S_AUTO_INTERVAL"))
            .setDesc(t("S_AUTO_INTERVAL_D"))
            .addText((text) =>
                text
                    .setValue(String(this.plugin.settings.realTimeUpdateInterval))
                    .onChange(async (value: string) => {

                        let numberValue = Number(value)
                        if (
                            isNaN(numberValue) ||
                            !Number.isInteger(numberValue) ||
                            numberValue <= 5 ||
                            numberValue > 3600
                        ) {


                            displayError(

                                t("E_INTERVAL_RANGE")
                            )
                            return
                        }

                        if (numberValue < 5) {
                            numberValue = 5
                        }
                        this.plugin.settings.realTimeUpdateInterval = numberValue
                        await this.plugin.saveSettings()
                        this.plugin.setupQueueInterval()
                    })
            )



        new Setting(containerEl)
            .setName(t("S_RETRIES"))
            .setDesc(t("S_RETRIES_D"))
            .addText((text) =>
                text
                    .setValue(String(this.plugin.settings.tryCount))
                    .onChange(async (value: string) => {

                        let numberValue = Number(value)
                        if (
                            isNaN(numberValue) ||
                            !Number.isInteger(numberValue) ||
                            numberValue < 1 ||
                            numberValue > 6
                        ) {
                            displayError(
                                t("E_RETRIES_RANGE")
                            )
                            return
                        }
                        this.plugin.settings.tryCount = numberValue
                        await this.plugin.saveSettings()
                    })
            )

        new Setting(containerEl)
            .setName(t("S_PROCESS_CREATED"))
            .setDesc(t("S_PROCESS_CREATED_D"))
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.processCreated)
                    .onChange(async (value) => {
                        this.plugin.settings.processCreated = value
                        await this.plugin.saveSettings()
                    })
            )


        new Setting(containerEl)
            .setName(t("S_PROCESS_ALL"))
            .setDesc(t("S_PROCESS_ALL_D"))
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.processAll)
                    .onChange(async (value) => {
                        this.plugin.settings.processAll = value
                        await this.plugin.saveSettings()
                    })
            )

        new Setting(containerEl)
            .setName(t("S_MD5"))
            .setDesc(t("S_MD5_D"))
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.useMD5ForNewAtt)
                    .onChange(async (value) => {
                        this.plugin.settings.useMD5ForNewAtt = value
                        await this.plugin.saveSettings()
                    })
            )

        new Setting(containerEl)
            .setName(t("S_DOWN_UNKNOWN"))
            .setDesc(t("S_DOWN_UNKNOWN_D"))
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.downUnknown)
                    .onChange(async (value) => {
                        this.plugin.settings.downUnknown = value
                        await this.plugin.saveSettings()
                    })
            )
        new Setting(containerEl)
            .setName(t("S_COMPRESS_WEB"))
            .setDesc(t("S_COMPRESS_WEB_D"))
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.PngToJpeg)
                    .onChange(async (value) => {
                        this.plugin.settings.PngToJpeg = value
                        await this.plugin.saveSettings()
                    })
            )

        new Setting(containerEl)
            .setName(t("S_COMPRESS_PASTED"))
            .setDesc(t("S_COMPRESS_PASTED_D"))
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.PngToJpegLocal)
                    .onChange(async (value) => {
                        this.plugin.settings.PngToJpegLocal = value
                        await this.plugin.saveSettings()
                    })
            )



        new Setting(containerEl)
            .setName(t("S_COMPRESS_TYPE"))
            .setDesc(t("S_COMPRESS_TYPE_D"))
            .addDropdown(dropdown => {
                dropdown
                    .addOption("image/webp", "WebP")
                    .addOption("image/jpeg", "JPEG")
                    .setValue(this.plugin.settings.ImgCompressionType)
                    .onChange(async (value) => {
                        this.plugin.settings.ImgCompressionType = value;
                        await this.plugin.saveSettings();
                    });
            });

        new Setting(containerEl)
            .setName(t("S_EXCLUDED_FOLDERS"))
            .setDesc(t("S_EXCLUDED_FOLDERS_D"))
            .addTextArea(text => {
                text
                    .setPlaceholder(t("S_EXCLUDED_FOLDERS_P"))
                    .setValue(this.plugin.settings.ExcludedFoldersList)
                    .onChange(async (value) => {

                    let FoldersArray = value.split(/\r?\n|\r|\n/g)
                    if (FoldersArray.length >= 1) {

                        let regexconverted = trimAny(FoldersArray.map((path) => { if (trimAny(path, [" ", "|", "/", "\\"]) !== "") { return "(^" + trimAny(path, [" ", "|", "/", "\\"]) + "$)" } }).join("|").replace('\\','/'), [" ", "|", "/", "\\"])
                        this.plugin.settings.ExcludedFoldersList = value;
                        this.plugin.settings.ExcludedFoldersListRegexp = regexconverted;
                        await this.plugin.saveSettings();
                        logError("Excluded folders regex:" + regexconverted);
                    }
            
                    });

                text.inputEl.rows = 4;        
                text.inputEl.style.width = "100%";  
            });

        new Setting(containerEl)
            .setName(t("S_QUALITY"))
            .setDesc(t("S_QUALITY_D"))
            .addText((text) =>
                text
                    .setValue(String(this.plugin.settings.JpegQuality))
                    .onChange(async (value: string) => {

                        let numberValue = Number(value)
                        if (
                            isNaN(numberValue) ||
                            !Number.isInteger(numberValue) ||
                            numberValue < 10 ||
                            numberValue > 100
                        ) {
                            displayError(
                                t("E_QUALITY_RANGE")
                            )
                            return
                        }
                        this.plugin.settings.JpegQuality = numberValue
                        await this.plugin.saveSettings()
                    })
            )


        new Setting(containerEl)
            .setName(t("S_SIZE_LIMIT"))
            .setDesc(t("S_SIZE_LIMIT_D"))
            .addText((text) =>
                text
                    .setValue(String(this.plugin.settings.filesizeLimit))
                    .onChange(async (value: string) => {

                        let numberValue = Number(value)
                        if (
                            isNaN(numberValue) ||
                            !Number.isInteger(numberValue) ||
                            numberValue < 0
                        ) {


                            displayError(

                                t("E_POSITIVE_INT")
                            )
                            return
                        }

                        if (numberValue < 0) {
                            numberValue = 0
                        }
                        this.plugin.settings.filesizeLimit = numberValue
                        await this.plugin.saveSettings()
                    })
            )

        new Setting(containerEl)
            .setName(t("S_EXCLUSIONS"))
            .setDesc(t("S_EXCLUSIONS_D"))
            .addText((text) =>
                text
                    .setValue(this.plugin.settings.ignoredExt)
                    .onChange(async (value) => {
                        this.plugin.settings.ignoredExt = value
                        await this.plugin.saveSettings()
                    })
            )


        new Setting(containerEl)
            .setName(t("S_NO_OBS_FOLDER"))
            .setDesc(t("S_NO_OBS_FOLDER_D"))
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.DoNotCreateObsFolder)
                    .onChange(async (value) => {
                        this.plugin.settings.DoNotCreateObsFolder = value
                        await this.plugin.saveSettings()
                    })
            )


        containerEl.createEl("h3", { text: t("H_NOTE") })

        new Setting(containerEl)
            .setName(t("S_CAPTIONS"))
            .setDesc(t("S_CAPTIONS_D"))
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.useCaptions)
                    .onChange(async (value) => {
                        this.plugin.settings.useCaptions = value
                        await this.plugin.saveSettings()
                    })
            )


        new Setting(containerEl)
            .setName(t("S_ADD_NAME"))
            .setDesc(t("S_ADD_NAME_D"))
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.addNameOfFile)
                    .onChange(async (value) => {
                        this.plugin.settings.addNameOfFile = value
                        await this.plugin.saveSettings()
                    })
            )




        new Setting(containerEl)
            .setName(t("S_INCLUDE"))
            .setDesc(
                t("S_INCLUDE_D")
            )
            .addText((text) =>
                text.setValue(this.plugin.settings.includeps).onChange(async (value) => {

                    //Transform string to regex
                    let ExtArray = value.split("|")
                    if (ExtArray.length >= 1) {
                        let regexconverted = trimAny(ExtArray.map((extension) => { if (trimAny(extension, [" ", "|"]) !== "") { return "(?<" + trimAny(extension, [" ", "|"]) + ">.*\\." + trimAny(extension, [" ", "|"]) + ")" } }).join("|"), [" ", "|"])


                        if (!safeRegex(value)) {
                            displayError(
                                t("E_UNSAFE_REGEX")
                            )
                            return
                        }
                        this.plugin.settings.includepattern = regexconverted
                        logError(regexconverted)
                        await this.plugin.saveSettings()
                    }
                })
            )

        containerEl.createEl("h3", { text: t("H_ORPHANS") })

        new Setting(containerEl)
            .setName(t("S_REMOVE_COMPLETELY"))
            .setDesc(t("S_REMOVE_COMPLETELY_D"))
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.removeOrphansCompl)
                    .onChange(async (value) => {
                        this.plugin.settings.removeOrphansCompl = value
                        await this.plugin.saveSettings()
                    })
            )

        containerEl.createEl("h3", { text: t("H_MEDIA_FOLDER") })

        new Setting(containerEl)
            .setName(t("S_PATH_IN_TAGS"))
            .setDesc(t("S_PATH_IN_TAGS_D"))
            .addDropdown((text) =>
                text
                    .addOption("fullDirPath", t("O_FULL_PATH"))
                    .addOption("onlyRelative", t("O_RELATIVE"))
                    .addOption("baseFileName", t("O_FILENAME"))
                    .setValue(this.plugin.settings.pathInTags)
                    .onChange(async (value) => {
                        this.plugin.settings.pathInTags = value
                        await this.plugin.saveSettings()
                    })
            )



        new Setting(containerEl)
            .setName(t("S_DATE_FORMAT"))
            .setDesc(t("S_DATE_FORMAT_D"))
            .addText((text) =>
                text.setValue(this.plugin.settings.DateFormat).onChange(async (value) => {
                    if (value.match(/(\)|\(|\"|\'|\#|\]|\[|\:|\>|\<|\*|\|)/g) !== null) {
                        displayError(
                            t("E_UNSAFE_FOLDER")
                        )
                        return
                    }
                    this.plugin.settings.DateFormat = value
                    await this.plugin.saveSettings()
                })
            )



        new Setting(containerEl)
            .setName(t("S_SAVE_WHERE"))
            .setDesc(t("S_SAVE_WHERE_D"))
            .addDropdown((text) =>
                text
                    .addOption("obsFolder", t("O_OBS_SETTINGS"))
                    .addOption("inFolderBelow", t("O_ROOT_BELOW"))
                    .addOption("nextToNoteS", t("O_NEXT_TO_NOTE"))
                    .setValue(this.plugin.settings.saveAttE)

                    .onChange(async (value) => {
                        this.plugin.settings.saveAttE = value
                        this.displSw(containerEl)

                        await this.plugin.saveSettings()
                    })
            )

        new Setting(containerEl)
            .setName(t("S_MOVE_FOLDER"))
            .setDesc(t("S_MOVE_FOLDER_D"))
            .setClass("media_folder_set")
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.removeMediaFolder)
                    .onChange(async (value) => {
                        this.plugin.settings.removeMediaFolder = value
                        await this.plugin.saveSettings()
                    })
            )


        new Setting(containerEl)
            .setName(t("S_MEDIA_FOLDER"))
            .setDesc(t("S_MEDIA_FOLDER_D"))
            .setClass("media_folder_set")
            .addText((text) =>
                text
                    .setValue(this.plugin.settings.mediaRootDir)
                    .onChange(async (value) => {

                        if (value.match(/(\)|\(|\"|\'|\#|\]|\[|\:|\>|\<|\*|\|)/g) !== null) {
                            displayError(
                                t("E_UNSAFE_FOLDER")
                            )
                            return
                        }
                        this.plugin.settings.mediaRootDir = value
                        await this.plugin.saveSettings()
                    })



            )


        containerEl.createEl("h3", { text: t("H_TROUBLESHOOTING") })
        new Setting(containerEl)
            .setName(t("S_DEBUG"))
            .setDesc(t("S_DEBUG_D"))
            .addToggle((toggle) =>
                toggle
                    .setValue(VERBOSE)
                    .onChange(async (value) => {
                        setDebug(value)
                        await this.plugin.saveSettings()
                    })
            )

        this.displSw(containerEl)
    }
}
