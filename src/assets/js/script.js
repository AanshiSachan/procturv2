//  function for tendering Templates
//  note-  pass parent container name[should be id], and second param is template name.4

var renderTemplates = (parentName, templateName) => {
    var link = document.querySelectorAll('link[data-list="' + templateName + '"]');
    if (link.length > 0) {
        for (var i = 0; i < link.length; i++) {
            var template = link[i].import.querySelector('template');
            var clone = document.importNode(template.content, true);
            document.getElementById(parentName).appendChild(clone);
        }

    }
}
renderTemplates('headerWrapper', 'header'); // call header panel
renderTemplates('middleWrapper', 'middle'); // call header panelaccordian
renderTemplates('commonPopup', 'popup'); // call popup component
renderTemplates('addNewEnquiry', 'newenquiry'); //add new enquiry form
renderTemplates('middleMain', 'accordian'); // call accordian component
renderTemplates('rightSideBar', 'rightSideBar'); // call rightSideBar component
renderTemplates('enquiryList', 'enquirylist'); // call enquiry component
renderTemplates('commonLeftNav', 'leftNav'); // call left nav component
renderTemplates('addBulkEnquiry', 'bulkenquiry'); // bulk enquiry component





// document.body.addEventListener("blur", function(event) {
//     if (event.target.classList.contains("form-ctrl")) {
//         if (event.target.value != '') {
//             event.target.parentNode.classList.add('has-value');
//         } else {
//             event.target.parentNode.classList.remove('has-value');
//         }
//     }
// });




















// var inpsToMonitor = document.querySelectorAll (
//     "form[name='JustCSS'] input[name^='inp']"
// );
// for (var J = inpsToMonitor.length - 1;  J >= 0;  --J) {
//     inpsToMonitor[J].addEventListener ("change",    adjustStyling, false);
//     inpsToMonitor[J].addEventListener ("keyup",     adjustStyling, false);
//     inpsToMonitor[J].addEventListener ("focus",     adjustStyling, false);
//     inpsToMonitor[J].addEventListener ("blur",      adjustStyling, false);
//     inpsToMonitor[J].addEventListener ("mousedown", adjustStyling, false);

//     //-- Initial update. note that IE support is NOT needed.
//     var evt = document.createEvent ("HTMLEvents");
//     evt.initEvent ("change", false, true);
//     inpsToMonitor[J].dispatchEvent (evt);
// }

// function adjustStyling (zEvent) {
//     var inpVal  = zEvent.target.value;
//     if (inpVal  &&  inpVal.replace (/^\s+|\s+$/g, "") )
//         zEvent.target.style.background = "lime";
//     else
//         zEvent.target.style.background = "inherit";
// }



// desktop popup


// popup method
/**
 * global popup method with 2 params first is if we want to show close btn and second is where we want to show 
 * closePopup method which will close popup 
 * openPopup method which will open popup
 * changeBtnPosition method for change position of close button in any where [topLeft,topRight,bottomRight,bottomLeft] can add more position classes in to arrayList
 */
var coaching = function() {

}
coaching.prototype.popupMethod = function(closeEnabled, positionClosureButton) {
    this.closeEnabled = closeEnabled;
    this.positionClosureButton = positionClosureButton;
    var popup = document.getElementById('popup');
    var closeBtn = document.getElementById('popupCloseBtn');

    if (this.closeEnabled) {
        closeBtn.classList.add('show');
    }
    this.closePopup = function() {
        popup.classList.remove('fadeIn');
        document.body.classList.remove('overflowHidden');
    };
    this.openPopup = function() {
        popup.classList.add('fadeIn');
        document.body.classList.add('overflowHidden');
    };
    this.togglePopUp = function() {
        popup.classList.toggle('fadeIn');
        document.body.classList.toggle('overflowHidden');
    };
    let helperRemoveFromArray = function(obj, arr) {
        arr.forEach((a) => obj.remove(a));
    }
    this.changeBtnPosition = function(pos) {
        if (this.closeEnabled) {
            if (pos) {
                this.positionClosureButton = pos;
            }
            let positions = ['bottomRight', 'topLeft', 'bottomLeft', 'topRight'];
            if (positions.indexOf(pos) == -1) {
                console.error('Position not to be mentioned');
                throw new Error('Position is not defined in types');
            } else {
                helperRemoveFromArray(closeBtn.classList, positions);
                closeBtn.classList.add(this.positionClosureButton);
            }
        }
    }

    // bind close method with close button
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closePopup();
    });
    // bind close method with escape button
    document.addEventListener('keydown', (e) => {
        if (e.keyCode == 27) {
            popup.classList.remove('fadeIn');
            document.body.classList.remove('overflowHidden');
        }
    });
    // bind close method when we click outside of popup
    popup.addEventListener('click', (e) => {
        console.log('inside click');
        if (e.target.classList.contains('popupWrapper')) {
            popup.classList.remove('fadeIn');
            document.body.classList.remove('overflowHidden');
        }
    });
}
coaching.prototype.checkEmptyValueOnBlur = function() {
    document.querySelectorAll('.form-ctrl').forEach(function(elm) {
        elm.addEventListener('blur', function(event) {
            if (event.target.value != '') {
                event.target.parentNode.classList.add('has-value');
            } else {
                event.target.parentNode.classList.remove('has-value');
            }
        });
    });
}
coaching.prototype.checkValueOnLoad = function() {
    document.querySelectorAll('.form-ctrl').forEach(function(elm) {
        if (elm.value != '') {
            elm.parentNode.classList.add('has-value');
        } else {
            elm.parentNode.classList.remove('has-value');
        }
    });
}

coaching.prototype.customSelect = function(wrapper) {
    wrapper.querySelectorAll('.form-ctrl').forEach(function(elm) {
        if (elm.tagName == 'SELECT') {
            var allOptions = elm.getElementsByTagName('option');
            var allreadyCustomDropDown = elm.parentNode.querySelector('.customDropdown');
            if (allreadyCustomDropDown != null) {
                allreadyCustomDropDown.remove();
            }
            if (allOptions.length > 0) {
                var listWrapper = document.createElement('ul');
                listWrapper.classList.add('customDropdown');
                for (var i = 0; i < allOptions.length; i++) {
                    var list = document.createElement('li');
                    list.innerHTML = allOptions[i].innerHTML;
                    listWrapper.appendChild(list);
                }
                elm.parentNode.appendChild(listWrapper);
                elm.parentNode.classList.add('customSelectWrapper');
                listWrapper.querySelectorAll('li').forEach(function(liList) {
                    liList.addEventListener('click', function() {
                        liList.parentNode.parentNode.querySelector('.form-ctrl').value = liList.innerHTML;
                        liList.parentNode.parentNode.classList.add('has-value');
                        liList.parentNode.classList.remove('visibleDropdown');
                        liList.parentNode.parentNode.querySelector('.form-ctrl').style.opacity = 1;
                    })
                })
            }
            // listWrapper.addEventListener
        }

    });
    wrapper.querySelectorAll('select.form-ctrl').forEach(function(elm) {
        elm.addEventListener('click', function() {
            document.querySelectorAll('.customDropdown').forEach(function(elm1) {
                elm1.parentNode.querySelector('.customDropdown').classList.remove('visibleDropdown');
            });
            elm.style.opacity = 0;
            elm.parentNode.querySelector('.customDropdown').classList.add('visibleDropdown');
        });
    });
    document.addEventListener('click', (e) => {
        if (!e.target.parentNode.classList.contains('customDropdown') && !e.target.parentNode.classList.contains('customSelectWrapper')) {
            document.querySelectorAll('.customDropdown').forEach(function(elm) {
                elm.classList.remove('visibleDropdown');
                elm.parentNode.querySelector('.form-ctrl').style.opacity = 1;
            });
        }
    });
}
coaching.prototype.showFilterBtn = function() {
    var filterBtn = document.querySelector('.showFilterBtn');
    var closeFilter = document.querySelector('.closeFilter');
    filterBtn.addEventListener('click', function() {
        document.getElementById('middleMainForEnquiryList').classList.add('hasFilter');
    });

    closeFilter.addEventListener('click', function() {
        document.getElementById('middleMainForEnquiryList').classList.remove('hasFilter');
    });
}
coaching.prototype.updateUploadFile = function() {
    var fileType = document.querySelector('.uploadFile');
    fileType.addEventListener('change', function() {
        document.querySelector('.uploadFileField').value = fileType.value;
    });
}
var coachingInstance = new coaching(); // create instance for payment
coachingInstance.popupMethod(true, 'topRight'); // call popup method
coachingInstance.checkValueOnLoad();
coachingInstance.checkEmptyValueOnBlur();
coachingInstance.customSelect(document);
coachingInstance.showFilterBtn();
coachingInstance.updateUploadFile();