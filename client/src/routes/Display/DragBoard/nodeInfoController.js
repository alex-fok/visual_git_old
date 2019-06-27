const $ = (id) => {return document.getElementById(id)};
const htmlNS = "http://www.w3.org/1999/xhtml";

export default {
	insertMsgInput: (idList, editable)=> {
		// const {
		// 	messageInputID,
		// 	messagePrependID,
		// 	messageID} = idList;
		
		// $(messageInputID).appendChild((()=> {
		// 	var messagePrepend = document.createElementNS(htmlNS, "div");
		// 	messagePrepend.setAttributeNS(null, "class", "input-group-prepend");

		// 	messagePrepend.appendChild((()=> {
		// 		var messagePrependText = document.createElementNS(htmlNS, "span");
		// 		messagePrependText.setAttributeNS(null, "class", "input-group-text bg-white text-secondary border-secondary");
		// 		messagePrependText.setAttributeNS(null, "id", messagePrependID);
		// 		messagePrependText.appendChild(document.createTextNode("Text"));
		// 		return messagePrependText;
		// 	})());
		// 	return messagePrepend;
		// })());

		// $(messageInputID).appendChild((()=> {
		// 	var messageInput = document.createElementNS(htmlNS, "input");
		// 	messageInput.setAttributeNS(null, "type", "text");
		// 	messageInput.setAttributeNS(null, "id", messageID);
		// 	messageInput.setAttributeNS(null, "class", "form-control");
		// 	messageInput.setAttributeNS(null, "placeholder", "Text...");
		// 	messageInput.setAttributeNS(null, "aria-label", "Text...");
		// 	messageInput.setAttributeNS(null, "aria-describedby", messagePrependID);
		// 	return messageInput;
		// })());
	},

	insertImgInput: (idList, editable)=> {
	// const {
	// 	imgInputID,
	// 	imgPrependID,
	// 	imgPreviewID,
	// 	imgID,
	// 	imgTxtID} = idList;
		
	// 	$(imgInputID).appendChild((()=> {
	// 		var imgPrepend = document.createElementNS(htmlNS, "label");
	// 		imgPrepend.setAttributeNS(null, "class", "input-group-prepend");

	// 		imgPrepend.appendChild((()=> {
	// 			var imgPrependBtn = document.createElementNS(htmlNS, "span");
	// 			imgPrependBtn.setAttributeNS(null, "id", imgPrependID);
	// 			imgPrependBtn.setAttributeNS(null, "class", "btn btn-outline-secondary");

	// 			imgPrependBtn.appendChild(document.createTextNode("Image"));
				
	// 			imgPrependBtn.appendChild((()=> {
	// 				var imgFileInput = document.createElementNS(htmlNS, "input");
	// 				imgFileInput.setAttributeNS(null, "type", "file");
	// 				imgFileInput.setAttributeNS(null, "accept", "image/*");
	// 				imgFileInput.setAttributeNS(null, "class", "form-control-file");
	// 				imgFileInput.setAttributeNS(null, "style", "display: none");

	// 				imgFileInput.addEventListener("change", (e)=> {
	// 					const val = imgFileInput.value;

	// 					$(imgTxtID).value = val.replace(/\\/g, '/').replace(/.*\//, '');
	// 					const imgs = e.target.files;
	// 					var fr = new FileReader();
	// 					fr.readAsDataURL(imgs[0]);

	// 					fr.onload = ()=>{
	// 						$(imgPreviewID).appendChild( (()=>{
	// 							var imgElement = document.createElementNS(htmlNS, "img");
	// 							imgElement.setAttributeNS(null, "id", imgID);
	// 							imgElement.setAttributeNS(null, "src", (()=> {return fr.result})());
	// 							return imgElement;
	// 						})());	
	// 					};
	// 				});
	// 				return imgFileInput; 
	// 			})());
	// 			return imgPrependBtn;
	// 		})());
	// 		return imgPrepend;
	// 	})());

	// 	$(imgInputID).appendChild((()=> {
	// 		var imgTxt = document.createElementNS(htmlNS, "input");
	// 		imgTxt.setAttributeNS(null, "type", "text");
	// 		imgTxt.setAttributeNS(null, "class", "form-control")
	// 		imgTxt.setAttributeNS(null, "id", imgTxtID);
	// 		imgTxt.setAttributeNS(null, "disabled", true);
	// 		imgTxt.setAttributeNS(null, "aria-labelledby", imgPrependID)

	// 		return imgTxt;
	// 	})());
	}
}