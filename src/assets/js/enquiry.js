var coaching = function () {

}

coaching.prototype.checkEmptyValueOnBlur = function () {
    document.querySelectorAll('.form-ctrl').forEach(function (elm) {
        elm.addEventListener('blur', function (event) {
            if (event.target.value != '') {
                event.target.parentNode.classList.add('has-value');
            } else {
                event.target.parentNode.classList.remove('has-value');
            }
        });
    });
}


coaching.prototype.checkValueOnLoad = function () {
    document.querySelectorAll('.form-ctrl').forEach(function (elm) {
        if (elm.value != '') {
            elm.parentNode.classList.add('has-value');
        } else {
            elm.parentNode.classList.remove('has-value');
        }
    });
}


coaching.prototype.customSelect = function (wrapper) {
    wrapper.querySelectorAll('.form-ctrl').forEach(function (elm) {
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
                listWrapper.querySelectorAll('li').forEach(function (liList) {
                    liList.addEventListener('click', function () {
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

    wrapper.querySelectorAll('select.form-ctrl').forEach(function (elm) {
        elm.addEventListener('click', function () {
            document.querySelectorAll('.customDropdown').forEach(function (elm1) {
                elm1.parentNode.querySelector('.customDropdown').classList.remove('visibleDropdown');
            });
            elm.style.opacity = 0;
            elm.parentNode.querySelector('.customDropdown').classList.add('visibleDropdown');
        });
    });
    
    
    document.addEventListener('click', (e) => {
        if (!e.target.parentNode.classList.contains('customDropdown') && !e.target.parentNode.classList.contains('customSelectWrapper')) {
            document.querySelectorAll('.customDropdown').forEach(function (elm) {
                elm.classList.remove('visibleDropdown');
                elm.parentNode.querySelector('.form-ctrl').style.opacity = 1;
            });
        }
    });
}


coaching.prototype.updateUploadFile = function () {
    var fileType = document.querySelector('.uploadFile');
    fileType.addEventListener('change', function () {
        document.querySelector('.uploadFileField').value = fileType.value;
    });
}

exports.coaching = coaching;

var coachingInstance = new coaching();

coachingInstance.checkValueOnLoad();
coachingInstance.checkEmptyValueOnBlur();
coachingInstance.customSelect(document);
coachingInstance.updateUploadFile();