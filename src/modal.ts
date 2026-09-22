import { App, Modal } from "obsidian";
import { APP_TITLE } from "./config";
import LocalImagesPlugin from "./main";
import { t } from "./lang";


export class ModalW1 extends Modal {

	plugin: LocalImagesPlugin;
	messg: string = "";
	callbackFunc: CallableFunction = null;
	 

	constructor(app: App) {
		super(app);
	}

	onOpen() {
		let { contentEl, titleEl } = this;
		titleEl.setText(APP_TITLE);
		const div = contentEl.createDiv({
			text: this.messg
		})


		contentEl.createEl("button", {
			cls: ["mod-cta"],
			text: t("CANCEL")
		}).addEventListener("click", async () => {
			this.close();
		});


		contentEl.createEl("button", {
			cls: ["mod-cta"],
			text: t("CONFIRM")
		}).addEventListener("click", async () => {
			 
			this.close();
			
			if (this.callbackFunc) {
				this.callbackFunc();
			}

		});
	}

	onClose() {
		let { contentEl } = this;
		contentEl.empty();
	}
}



export class ModalW2 extends Modal {

	plugin: LocalImagesPlugin;
	messg: string = "";

	constructor(app: App) {
		super(app);
	}

	onOpen() {
		let { contentEl, titleEl } = this;
		titleEl.setText(APP_TITLE);
		const div = contentEl.createDiv({
			text: this.messg
		})

 		contentEl.createEl("button", {
			cls: ["mod-cta"],
			text: t("OK")
		}).addEventListener("click", async () => {
			 
			this.close();
 

		});
	}

	onClose() {
		let { contentEl } = this;
		contentEl.empty();
	}
}
