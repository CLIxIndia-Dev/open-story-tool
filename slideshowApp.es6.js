///<reference path="libs/jquery.d.ts" />
///<reference path="libs/jqueryui.d.ts" />
window.onload = () => {
    const el = document.getElementById("content");
    const slideApp = new Slideshow.SlideshowApp(el);
    var buttons = document.getElementsByTagName('button')
    for(i = 0;i < buttons.length; i++)
    {
        buttons[i].title = buttons[i].innerText
    }
};
var Slideshow;
((Slideshow => {
    const Audio = ((() => {
        class Audio {
            constructor(audioElement) {
                this.isRecording = false;
                const ContextClass = window.AudioContext || window.webkitAudioContext;
                this.context = new ContextClass();
                this.navigator = window.navigator;
                this.audioElement = audioElement;
            }

            setStream(stream) {
                this.audioStream = stream;
                const streamSource = this.context.createMediaStreamSource(stream);
                this.recorder = new Recorder(streamSource, { workerPath: "libs/recorderWorker.js" });
                const event = new Event('audio_ready');
                document.dispatchEvent(event);
            }

            getTime() {
                return this.context.currentTime;
            }

            record() {
                this.recorder.clear();
                this.recorder.record();
                this.isRecording = true;
            }

            stopRecording() {
                const _this = this;
                this.recorder.stop();
                this.isRecording = false;
                this.recorder.exportWAV(blob => {
                    _this.load(blob);
                });
            }

            load(blob) {
                if (blob) {
                    this.audioBlob = blob;
                    this.audioElement.src = URL.createObjectURL(blob);
                }
            }

            play() {
                this.audioElement.play();
            }

            pause() {
                this.audioElement.pause();
            }

            stop() {
                this.audioElement.pause();
                this.audioElement.currentTime = 0;
            }

            clear() {
                if (this.recorder) {
                    this.recorder.clear();
                }
                this.audioBlob = null;
                this.audioElement.src = "";
            }
        }

        return Audio;
    })());
    Slideshow.Audio = Audio;
}))(Slideshow || (Slideshow = {}));
var Slideshow;
((Slideshow => {
    const Data = ((() => {
        class Data {
            constructor() {
                this.session = "";
                this.remoteLocation = "";
                this.events = [];
            }

            startSession() {
                try {
                    this.session = Slideshow.Utils.getCookie("session_uuid");
                }
                catch (e) {
                    console.log("Cannot get session id cookie");
                }
            }

            logEvent(eventName, params) {
                if (params === void 0) { params = {}; }
                const event = new SlideshowEvent();
                event.event_type = eventName;
                event.session_id = this.session;
                if (params != null && params != {}) {
                    event.params = JSON.stringify(params);
                }
                this.events.push(event);
                if (this.session != "" && this.remoteLocation != "") {
                    const xhr = new XMLHttpRequest();
                    xhr.open('POST', this.remoteLocation, true);
                    xhr.setRequestHeader("x-api-proxy", this.session)
                    xhr.setRequestHeader("Content-Type", "application/json");
                    xhr.send(JSON.stringify(event));
                }
            }
        }

        return Data;
    })());
    Slideshow.Data = Data;
    var SlideshowEvent = ((() => {
        function SlideshowEvent() {
            this.app_name = "OpenStory";
        }
        return SlideshowEvent;
    })());
    Slideshow.SlideshowEvent = SlideshowEvent;
    ((SlideshowEventType => {
        // 15 character limit in database
        SlideshowEventType[SlideshowEventType["NEW_SESSION"] = "new_session"] = "NEW_SESSION";
        // params: filename, gallery
        SlideshowEventType[SlideshowEventType["FILE_CREATED"] = "file_created"] = "FILE_CREATED";
        SlideshowEventType[SlideshowEventType["FILE_OPENED"] = "file_opened"] = "FILE_OPENED";
        // params: filename, file_session_id
        SlideshowEventType[SlideshowEventType["FILE_SAVED"] = "file_saved"] = "FILE_SAVED";
        // params: filename
        SlideshowEventType[SlideshowEventType["TEMPLATE_SAVED"] = "template_saved"] = "TEMPLATE_SAVED";
        // params: filename
        SlideshowEventType[SlideshowEventType["SLIDESHOW_EXPORTED"] = "show_exported"] = "SLIDESHOW_EXPORTED";
        // params: filename
        // All events below also contain a "slide" param
        SlideshowEventType[SlideshowEventType["SLIDESHOW_PLAYED"] = "show_played"] = "SLIDESHOW_PLAYED";
        // params: index
        SlideshowEventType[SlideshowEventType["SLIDESHOW_PAUSED"] = "show_paused"] = "SLIDESHOW_PAUSED";
        // params: index
        SlideshowEventType[SlideshowEventType["SLIDE_ADDED"] = "slide_added"] = "SLIDE_ADDED";
        SlideshowEventType[SlideshowEventType["SLIDE_DELETED"] = "slide_deleted"] = "SLIDE_DELETED";
        SlideshowEventType[SlideshowEventType["SLIDE_LOCKED"] = "slide_locked"] = "SLIDE_LOCKED";
        SlideshowEventType[SlideshowEventType["SLIDE_UNLOCKED"] = "slide_unlocked"] = "SLIDE_UNLOCKED";
        SlideshowEventType[SlideshowEventType["SLIDE_DUPLICATED"] = "slide_duped"] = "SLIDE_DUPLICATED";
        SlideshowEventType[SlideshowEventType["SLIDE_EDITED"] = "slide_edited"] = "SLIDE_EDITED";
        SlideshowEventType[SlideshowEventType["SLIDE_MOVED"] = "slide_moved"] = "SLIDE_MOVED";
        // params: prevIndex, newIndex
        SlideshowEventType[SlideshowEventType["IMAGE_ADDED"] = "image_added"] = "IMAGE_ADDED";
        // params: source, filename
        SlideshowEventType[SlideshowEventType["AUDIO_ADDED"] = "audio_added"] = "AUDIO_ADDED";
        // params: source, length
        SlideshowEventType[SlideshowEventType["CAPTION_EDITED"] = "caption_edited"] = "CAPTION_EDITED";
        // params: value
        SlideshowEventType[SlideshowEventType["DURATION_EDITED"] = "duration_edited"] = "DURATION_EDITED";
        // params: value
        SlideshowEventType[SlideshowEventType["ELEMENT_LOCKED"] = "element_locked"] = "ELEMENT_LOCKED";
        // params: element(image|audio|caption|duration)
        SlideshowEventType[SlideshowEventType["ELEMENT_UNLOCKED"] = "element_unlocked"] = "ELEMENT_UNLOCKED";
        // params: element(image|audio|caption|duration)
        SlideshowEventType[SlideshowEventType["SLIDE_CLOSED"] = "slide_closed"] = "SLIDE_CLOSED";
    }))(Slideshow.SlideshowEventType || (Slideshow.SlideshowEventType = {}));
    const SlideshowEventType = Slideshow.SlideshowEventType;
}))(Slideshow || (Slideshow = {}));
var Slideshow;
((Slideshow => {
    const Gallery = ((() => {
        class Gallery {
            constructor(element, filenames, fileLocation) {
                if (filenames === void 0) { filenames = []; }
                if (fileLocation === void 0) { fileLocation = ""; }
                this.container = $(element);
                this.filenames = filenames;
                this.location = fileLocation;
            }

            createDom() {
                const _this = this;
                this.controlBar = $('<div/>')
                    .addClass('controlBar');
                this.container.append(this.controlBar);
                const closeBtn = $('<button><i class="fa fa-times-circle"></i></button>')
                    .addClass('closeBtn')
                    .attr('id', 'galleryCloseBtn')
                    .click(() => {
                    if (_this.closeHandler) {
                        _this.closeHandler();
                    }
                });
                this.controlBar.append(closeBtn);
                this.content = $('<div/>')
                    .addClass('content');
                this.container.append(this.content);
                if (this.filenames.length > 0) {
                    this.populate();
                }
            }

            populate() {
                const _this = this;

                for (const file of this.filenames) {
                    const imgDiv = $('<div/>');
                    imgDiv.addClass('imgBlock');
                    const img = $('<img>');
                    img.attr('src', this.location + file);
                    imgDiv.append(img);
                    const lbl = $('<div/>');
                    lbl.text(file);
                    imgDiv.append(lbl);
                    this.content.append(imgDiv);
                    img.click({ img: img[0] }, event => {
                        if (_this.selectHandler) {
                            _this.selectHandler.call(null, event.data.img.src);
                        }
                    });
                }
            }
        }

        return Gallery;
    })());
    Slideshow.Gallery = Gallery;
}))(Slideshow || (Slideshow = {}));
var Slideshow;
((Slideshow => {
    const PlaybackEvent = ((() => {
        function PlaybackEvent() {
        }
        PlaybackEvent.START = "playback_start";
        PlaybackEvent.NEXT = "playback_next";
        PlaybackEvent.PAUSE = "playback_pause";
        PlaybackEvent.FINISH = "playback_finish";
        return PlaybackEvent;
    })());
    Slideshow.PlaybackEvent = PlaybackEvent;
    const Playback = ((() => {
        class Playback {
            constructor(show, startIndex) {
                if (startIndex === void 0) { startIndex = 0; }
                this.playing = false;
                this.show = show;
                this.curSlide = startIndex - 1;
            }

            start() {
                this.nextSlide();
                this.playing = true;
                const event = new Event(PlaybackEvent.START);
                document.dispatchEvent(event);
            }

            pause() {
                clearTimeout(this.timerID);
                this.curSlide--;
                this.playing = false;
                const event = new Event(PlaybackEvent.PAUSE);
                document.dispatchEvent(event);
            }

            stop() {
                clearTimeout(this.timerID);
                this.curSlide = -1;
                this.playing = false;
                const event = new Event(PlaybackEvent.FINISH);
                document.dispatchEvent(event);
            }

            nextSlide() {
                const _this = this;
                if (this.curSlide >= this.show.getLength() - 1) {
                    this.stop();
                    return;
                }
                this.curSlide++;
                const slide = this.show.getSlideAt(this.curSlide);
                this.timerID = window.setTimeout(() => { _this.nextSlide(); }, slide.duration * 1000);
                // trigger img/text/audio update, selected slide indicator
                const event = new Event(PlaybackEvent.NEXT);
                document.dispatchEvent(event);
            }
        }

        return Playback;
    })());
    Slideshow.Playback = Playback;
}))(Slideshow || (Slideshow = {}));
var Slideshow;
((Slideshow => {
    const SlideControl = ((() => {
        class SlideControl {
            constructor() {
                this.createDom();
            }

            createDom() {
                this.element = $("<div/>")
                    .addClass("slideControl");
                this.order = $("<div/>")
                    .addClass("orderCol");
                this.element.append(this.order);
                this.editBtn = $("<button></button>")
                    .addClass("iconBtn slideControl-editBtn")
                    .append($("<img src='icons/pencil.icon.png'/>"));
                this.element.append(this.editBtn);
                this.lockBtn = $("<button></button>")
                    .addClass("iconBtn slideControl-lockBtn")
                    .addClass("lockToggleBtn")
                    .append('<i class="fa fa-unlock-alt" > </i>');
                this.element.append(this.lockBtn);
                this.image = $("<img/>")
                    .addClass("slideControl-img");
                const imgHolder = $("<div></div>")
                    .addClass("ctrlImgHolder");
                imgHolder.append(this.image);
                this.element.append(imgHolder);
                this.dragHandle = $("<div/>")
                    .addClass("slide-drag-handle")
                    .append($("<img src='icons/move.icon.png'/>"));
                this.duplicateBtn = $("<button></button>")
                    .addClass("iconBtn slideControl-dupBtn")
                    .append($("<img src='icons/duplicate.icon.png'/>"));
                this.deleteBtn = $("<button></button>")
                    .addClass("iconBtn slideControl-delBtn")
                    .append($("<img src='icons/trash.icon.png'/>"));
                this.element.append(this.duplicateBtn);
                this.element.append(this.deleteBtn);
                this.element.append(this.dragHandle);
                this.deleteModal = $("<div title='Delete this slide?'></div>")
                    .addClass("deleteModal")
                    .append("<div>Delete this slide?</div>");
                this.deleteConfirmBtn = $("<button>Delete</button>")
                    .addClass("textBtn");
                this.deleteCancelBtn = $("<button>Cancel</button>")
                    .addClass("textBtn");
                this.deleteModal.append(this.deleteConfirmBtn);
                this.deleteModal.append(this.deleteCancelBtn);
                this.element.append(this.deleteModal);
                this.deleteModal.addClass("hidden");
            }

            setImageSrc(src) {
                if (src && src != "undefined" && src != "") {
                    this.image.attr("src", src);
                }
                else {
                    this.image.removeAttr("src");
                }
                return src;
            }

            setOrder(order) {
                this.order.text(order.toString());
            }

            getImageSrc() {
                return this.image.attr("src");
            }

            getElement() {
                return this.element[0];
            }

            select() {
                this.element.addClass("selected");
            }

            deselect() {
                this.element.removeClass("selected");
            }
        }

        return SlideControl;
    })());
    Slideshow.SlideControl = SlideControl;
}))(Slideshow || (Slideshow = {}));
var Slideshow;
((Slideshow => {
    const SlideEditor = ((() => {
        class SlideEditor {
            constructor() {
                this.createDom();
            }

            createDom() {
                this.element = $("<div/>")
                    .addClass("slideEditor");
                this.titleInput = $("<input type='text'/>")
                    .val("# characters limit");
                const titleDiv = $("<div></div>")
                    .text("Title: ")
                    .append(this.titleInput);
                this.element.append(titleDiv);
                const imgUploadBtn = $("<button><i class='fa fa-upload'/></button>");
                const imgDiv = $("<div/>");
                this.saveBtn = $("<button>Save Slide</button>")
                    .addClass("slideEditor-saveBtn");
                this.element.append(this.saveBtn);
                this.closeBtn = $("<button>Close</button>")
                    .addClass("slideEditor-closeBtn");
                this.element.append(this.closeBtn);
            }
        }

        return SlideEditor;
    })());
    Slideshow.SlideEditor = SlideEditor;
}))(Slideshow || (Slideshow = {}));
/// <reference path='libs/jquery.d.ts'/>
/// <reference path='libs/jquery.i18n.d.ts'/>
var Slideshow;
((Slideshow => {
    const Localization = ((() => {
        class Localization {
            init() {
                const i18n = $.i18n();
                let language; //, person, kittens, message, gender;
                // Enable debug
                i18n.debug = true;
                /*
                message = '$1 has $2 {{plural:$2|kitten|kittens}}. '
                    + '{{gender:$3|He|She}} loves to play with {{plural:$2|it|them}}.';
                language = $('.language option:selected').val();
                person = $('.person option:selected').text();
                gender = $('.person option:selected').val();
                kittens = $('.kittens').val();
                */
                //i18n.locale = "es";
                //console.log("locale: " + i18n.locale);
                i18n.load(`i18n/${i18n.locale}.json`, i18n.locale).done(() => {
                    //console.log("i18n locale file loaded");
                    $("span[data-i18n]").each((index, elem) => {
                        const id = $(elem).attr("data-i18n");
                        //console.log(id + ":" + $.i18n(id));
                        $(elem).text($.i18n(id));
                    });
                    //var personName = $.i18n(person), localizedMessage = $.i18n(message, personName,
                    //    kittens, gender);
                    //$('.result').text(localizedMessage).prop('title', message.toLocaleString());
                });
            }
        }

        return Localization;
    })());
    Slideshow.Localization = Localization;
}))(Slideshow || (Slideshow = {}));
/// <reference path='localization.ts'/>
var Slideshow;
((Slideshow => {
    let State;
    ((State => {
        State[State["Init"] = 0] = "Init";
        State[State["Ready"] = 1] = "Ready";
        State[State["Loading"] = 2] = "Loading";
        State[State["Show"] = 3] = "Show";
        State[State["Slide"] = 4] = "Slide";
        State[State["SlideCam"] = 5] = "SlideCam";
        State[State["SlideAudio"] = 6] = "SlideAudio";
        State[State["Play"] = 7] = "Play";
    }))(State || (State = {}));
    ;
    let FileMode;
    ((FileMode => {
        FileMode[FileMode["W"] = 0] = "W";
        FileMode[FileMode["T"] = 1] = "T";
        FileMode[FileMode["V"] = 2] = "V";
    }))(FileMode || (FileMode = {}));
    ;
    const SlideshowApp = ((() => {
        class SlideshowApp {
            constructor(element) {
                const _this = this;
                this.workMode = FileMode.W;
                this.exportMode = FileMode.W;
                this.isLoadingShow = true;
                this.slideThumbs = {};
                this.maxSlides = 20;
                this.maxAudioTime = 40;
                this.state = State.Init;
                this.show = new Slideshow.Show();
                this.ui = new Slideshow.UI(element);
                this.data = new Slideshow.Data();
//                this.data.remoteLocation = "/api/appdata/"; // old remote
                this.data.remoteLocation = '/api/v1/logging/genericlog';
                this.data.startSession();
                const startParams = {};
                const startingFile = Slideshow.Utils.getUrlVars()["file"];
                if (startingFile != null && startingFile != "") {
                    this.loadShowURL(Slideshow.Utils.getParentURL() + startingFile);
                    startParams["filename"] = startingFile;
                }
                this.imgFolder = Slideshow.Utils.getUrlVars()["gallery"];
                if (this.imgFolder == undefined) {
                    this.imgFolder = "";
                }
                else {
                    startParams["gallery"] = this.imgFolder;
                    this.imgFolder = `${this.imgFolder}/`;
                }
                const jqXHR = $.getJSON(`images/${this.imgFolder}`, json => { _this.loadGallery(json); })
                    .fail(() => {
                    $.getJSON("images/files.json", json => { _this.loadGallery(json); });
                });
                this.data.logEvent(Slideshow.SlideshowEventType.NEW_SESSION, startParams);
                this.audio = new Slideshow.Audio(this.ui.recordedAudio);
                $(this.ui.loadPictureBtn).on('click', () => {
                    _this.setState(State.Slide);
                    // trigger open file dialog
                    _this.ui.imgFileInput.click();
                });
                $(this.ui.useWebcamBtn).on('click', () => {
                    if (!_this.webcam || !_this.webcam.streaming) {
                        _this.initMedia(() => {
                            _this.useWebcam();
                            _this.setState(State.SlideCam);
                        });
                    }
                    else {
                        _this.useWebcam();
                        _this.setState(State.SlideCam);
                    }
                });
                $("#takePictureBtn").on('click', () => {
                    _this.takePicture();
                    _this.setState(State.Slide);
                });
                $("#cancelPictureBtn").on('click', () => {
                    _this.setState(State.Slide);
                });
                $("#imgFileInput").on("change", () => {
                    _this.loadUserImageFile(_this.ui.imgFileInput.files[0]);
                });
                $("#galleryBtn").on("click", () => {
                    _this.ui.showGallery();
                });
                $("#loadAudioBtn").on('click', () => {
                    $("#audioFileInput")[0].click();
                    _this.setState(State.SlideAudio);
                });
                $("#audioFileInput").on("change", () => {
                    _this.loadUserAudioFile($("#audioFileInput")[0].files[0]);
                });
                $("#recordAudioBtn").on('click', () => {
                    if (!_this.webcam || !_this.webcam.streaming) {
                        _this.initMedia(() => {
                            _this.setState(State.SlideAudio);
                        });
                    }
                    else {
                        _this.setState(State.SlideAudio);
                    }
                });
                $("#toggleRecordBtn").on('click', () => {
                    if (!_this.audio.isRecording) {
                        _this.startRecording();
                    }
                    else {
                        _this.stopRecording();
                    }
                });
                $(this.ui.deleteAudioBtn).on('click', () => {
                    _this.audio.clear();
                    _this.workingSlide.audio = null;
                    _this.workingSlide.audioData = null;
                    $("#audioFilename").addClass("hidden");
                });
                $(this.ui.captionInput).on('change', () => {
                    $(_this.ui.captionHolder).html(Slideshow.Utils.toHTML(_this.ui.captionInput.value));
                    _this.data.logEvent(Slideshow.SlideshowEventType.CAPTION_EDITED, { 'value': _this.ui.captionInput.value });
                });
                $(this.ui.durationInput).on('change', () => {
                    _this.data.logEvent(Slideshow.SlideshowEventType.DURATION_EDITED, { 'value': _this.ui.durationInput.value });
                });
                $(this.ui.newShowBtn).on('click', () => {
                    _this.checkForSave(() => {
                        _this.newShow();
                    });
                });
                $(this.ui.loadShowBtn).on('click', () => {
                    _this.checkForSave(() => {
                        // trigger file open dialog
                        _this.ui.slideFileInput.click();
                    });
                });
                $(this.ui.saveShowBtn).on('click', () => {
                    _this.exportMode = FileMode.W;
                    _this.saveSlides();
                });
                $("#saveTemplateBtn").on("click", () => {
                    _this.exportMode = FileMode.T;
                    _this.saveSlides();
                });
                $(this.ui.exportShowBtn).on('click', () => {
                    _this.exportMode = FileMode.V;
                    _this.saveSlides();
                });
                this.ui.slideFileInput.onchange = () => {
                    const file = _this.ui.slideFileInput.files[0];
                    _this.loadShowFile(file);
                };
                $(this.ui.addSlideBtn).on('click', () => {
                    if (_this.show.getLength() < _this.maxSlides) {
                        _this.addSlide();
                        _this.setSlide(_this.curSlide.id);
                    } else {
                        alert("You have reached the maximum number of slides")
                    }
                });
                $(this.ui.playShowBtn).on('click', () => {
                    if (!_this.playback) {
                        _this.playShow();
                    }
                    else if (!_this.playback.playing) {
                        _this.resumeShow();
                    }
                    else {
                        _this.pauseShow();
                    }
                });
                $("#saveSlideBtn").on("click", () => {
                    _this.updateSlide();
                    _this.setState(State.Show);
                    _this.data.logEvent(Slideshow.SlideshowEventType.SLIDE_CLOSED, { 'saved': 'true' });
                });
                $("#cancelSlideBtn").on("click", () => {
                    _this.workingSlide = null;
                    _this.ui.slideImg.src = _this.curSlide.image;
                    _this.setState(State.Show);
                    _this.ui.setEditLocks(_this.curSlide.lockedFields, _this.workMode == FileMode.T);
                    _this.data.logEvent(Slideshow.SlideshowEventType.SLIDE_CLOSED, { 'saved': 'false' });
                });
                $(this.ui.slideRoll).sortable({
                    containment: this.ui.slideRoll.parentElement,
                    stop(e, ui) {
                        const target = $(e.originalEvent.target).closest('div[id^="slide"');
                        const slideId = target.attr('id');
                        const slide = _this.show.getSlide(slideId);
                        const prevIndex = _this.show.getSlideIndex(slide);
                        _this.updateSlideOrder();
                        const newIndex = _this.show.getSlideIndex(slide);
                        _this.data.logEvent(Slideshow.SlideshowEventType.SLIDE_MOVED, { 'slide': slideId, 'prevIndex': prevIndex, 'newIndex': newIndex });
                    }
                });
                $(this.ui.slideEditor).addClass("hidden");
                $('#lockImgBtn').on('click', e => {
                    if (_this.workMode != FileMode.T) {
                        const val = _this.workingSlide.lockedFields[Slideshow.SlideField.Image] =
                            !_this.workingSlide.lockedFields[Slideshow.SlideField.Image];
                        _this.ui.toggleLock($(e.currentTarget));
                        const eventType = val ? Slideshow.SlideshowEventType.ELEMENT_LOCKED : Slideshow.SlideshowEventType.ELEMENT_UNLOCKED;
                        _this.data.logEvent(eventType, { 'element': 'image' });
                    }
                });
                $('#lockAudioBtn').on('click', e => {
                    if (_this.workMode != FileMode.T) {
                        const val = _this.workingSlide.lockedFields[Slideshow.SlideField.Audio] =
                            !_this.workingSlide.lockedFields[Slideshow.SlideField.Audio];
                        _this.ui.toggleLock($(e.currentTarget));
                        const eventType = val ? Slideshow.SlideshowEventType.ELEMENT_LOCKED : Slideshow.SlideshowEventType.ELEMENT_UNLOCKED;
                        _this.data.logEvent(eventType, { 'element': 'audio' });
                    }
                });
                $('#lockCaptionBtn').on('click', e => {
                    if (_this.workMode != FileMode.T) {
                        const val = _this.workingSlide.lockedFields[Slideshow.SlideField.Caption] =
                            !_this.workingSlide.lockedFields[Slideshow.SlideField.Caption];
                        _this.ui.toggleLock($(e.currentTarget));
                        const eventType = val ? Slideshow.SlideshowEventType.ELEMENT_LOCKED : Slideshow.SlideshowEventType.ELEMENT_UNLOCKED;
                        _this.data.logEvent(eventType, { 'element': 'caption' });
                    }
                });
                $('#lockDurationBtn').on('click', e => {
                    if (_this.workMode != FileMode.T) {
                        const val = _this.workingSlide.lockedFields[Slideshow.SlideField.Duration] =
                            !_this.workingSlide.lockedFields[Slideshow.SlideField.Duration];
                        _this.ui.toggleLock($(e.currentTarget));
                        const eventType = val ? Slideshow.SlideshowEventType.ELEMENT_LOCKED : Slideshow.SlideshowEventType.ELEMENT_UNLOCKED;
                        _this.data.logEvent(eventType, { 'element': 'duration' });
                    }
                });
                $('#deleteImgBtn').on('click', e => {
                    _this.workingSlide.image = _this.ui.slideImg.src = "";
                    $('#imgFilename').addClass('hidden');
                });
                this.localization = new Slideshow.Localization();
                this.localization.init();
                this.addSlide();
                this.isLoadingShow = false;
            }

            loadGallery(json) {
                const _this = this;
                const files = json["files"];
                this.gallery = new Slideshow.Gallery($("#gallery")[0], files, `images/${this.imgFolder}`);
                this.gallery.createDom();
                this.gallery.selectHandler = param => {
                    _this.onGallerySelect(param);
                };
                this.gallery.closeHandler = () => {
                    _this.ui.hideGallery();
                };
            }

            initMedia(callback) {
                const _this = this;
                navigator.getMedia = (navigator.getUserMedia ||
                    navigator.webkitGetUserMedia ||
                    navigator.mozGetUserMedia ||
                    navigator.msGetUserMedia);
                navigator.getMedia({
                    video: true,
                    audio: true
                }, stream => {
                    _this.webcam = new Slideshow.Webcam(stream, _this.ui.camVideo, _this.ui.camCanvas);
                    _this.audio.setStream(stream);
                    document.addEventListener('audio_ready', () => {
                        console.log('audio_ready');
                    });
                    _this.setState(State.Ready);
                    callback();
                }, error => {
                    console.log(`Webcam not accessible: ${error.message}`);
                });
            }

            clearAll() {
                $(this.ui.slideRoll).empty();
                this.ui.slideImg.src = "";
                this.show = new Slideshow.Show();
                this.slideThumbs = {};
                $("#nameTxtInput").val("");
                this.ui.setEditLocks([false, false, false, false], false);
                this.setState(State.Show);
                this.addSlide();
            }

            checkForSave(callback) {
                const _this = this;
                if (this.workMode == FileMode.V) {
                    callback();
                    return;
                }
                this.ui.showDialog("Hey, you're about to open a new slideshow.<br> Save this slideshow first?", [
                    {
                        text: "OK",
                        fn() {
                            _this.exportMode = FileMode.W;
                            _this.saveSlides(() => {
                                callback();
                            });
                        }
                    },
                    {
                        text: "Don't Save",
                        fn() {
                            callback();
                        }
                    },
                    {
                        text: "Cancel",
                        fn() {
                        }
                    }
                ]);
            }

            newShow() {
                this.workMode = FileMode.W;
                this.setWorkMode(FileMode.W);
                // prevent slide_added event from firing
                this.isLoadingShow = true;
                this.clearAll();
                this.isLoadingShow = false;
                this.data.logEvent(Slideshow.SlideshowEventType.FILE_CREATED);
            }

            setWorkMode(mode) {
                switch (mode) {
                    case FileMode.W:
                        $("#saveShowBtn").removeClass("hidden");
                        $("#saveTemplateBtn").removeClass("hidden");
                        $("#exportShowBtn").removeClass("hidden");
                        break;
                    case FileMode.T:
                        $("#saveShowBtn").removeClass("hidden");
                        $("#saveTemplateBtn").removeClass("hidden");
                        $("#exportShowBtn").removeClass("hidden");
                        break;
                    case FileMode.V:
                        $("#slideRollHolder").addClass("hidden");
                        $("#saveShowBtn").addClass("hidden");
                        $("#saveTemplateBtn").addClass("hidden");
                        $("#exportShowBtn").addClass("hidden");
                        break;
                }
            }

            setState(newState) {
                if (this.state != newState) {
                    // exit current state
                    switch (this.state) {
                        case State.SlideAudio:
                            if (this.curSlide.audio == null) {
                                $("#recordedAudio").addClass("hidden");
                            }
                            $("#recordAudioControls").addClass("hidden");
                            break;
                        case State.SlideCam:
                            $("#takePictureBtn").addClass("hidden");
                            $("#cancelPictureBtn").addClass("hidden");
                            this.ui.useWebcamBtn.disabled = false;
                            $("#camVideo").addClass("hidden");
                            if (this.webcam && this.webcam.streaming) {
                                this.webcam.stop();
                            }
                            break;
                        default:
                            break;
                    }
                }
                // enter new state
                switch (newState) {
                    case State.Ready:
                        break;
                    case State.Slide:
                        $("#playShowBtn").addClass("hidden");
                        $("#slideRollHolder").addClass("hidden");
                        $("#slideEditor").removeClass("hidden");
                        $("#takePictureBtn").addClass("hidden");
                        if (this.curSlide.audio != null) {
                            $("#recordedAudio").removeClass("hidden");
                        }
                        $("#recordAudioBtn").removeClass("disabled");
                        break;
                    case State.SlideAudio:
                        $("#recordAudioBtn").addClass("disabled");
                        $("#takePictureBtn").addClass("hidden");
                        $("#recordedAudio").removeClass("hidden");
                        $("#recordAudioControls").removeClass("hidden");
                        break;
                    case State.SlideCam:
                        $("#takePictureBtn").removeClass("hidden");
                        $("#cancelPictureBtn").removeClass("hidden");
                        break;
                    case State.Show:
                        $("#slideEditor").addClass("hidden");
                        $("#recordAudioControls").addClass("hidden");
                        $("#takePictureBtn").addClass("hidden");
                        $("#recordedAudio").addClass("hidden");
                        $("#slideRollHolder").removeClass("hidden");
                        $("#playShowBtn").removeClass("hidden");
                        if (this.webcam) {
                            this.webcam.stop();
                        }
                        break;
                }
                this.state = newState;
            }

            updateSlideOrder() {
                const children = $(this.ui.slideRoll).children();
                for (let i = 0; i < children.length; i++) {
                    const child = children[i];
                    const slide = this.show.getSlide(child.id);
                    this.show.removeSlide(child.id);
                    this.show.addSlideAt(slide, i);
                    const thumb = this.slideThumbs[slide.id];
                    thumb.setOrder(i + 1);
                }
            }

            loadUserAudioFile(file) {
                const _this = this;
                if (file.type.substring(0, 5) != 'audio') {
                    // TODO: show error msg
                    console.log('invalid audio file');
                    return;
                }
                const reader = new FileReader();
                reader.onload = e => {
                    const file = e.target.result;
                    const dataview = new DataView(file);
                    _this.workingSlide.audio = new Blob([dataview], { type: 'audio/wav' });
                    _this.audio.load(_this.workingSlide.audio);
                };
                reader.readAsArrayBuffer(file);
                this.ui.setFilename($("#audioFilename"), `${this.curSlide.id}audio.wav`);
                this.data.logEvent(Slideshow.SlideshowEventType.AUDIO_ADDED, { 'source': 'computer' });
            }

            loadUserImageFile(file) {
                const _this = this;
                if (file.type.substring(0, 5) != 'image') {
                    // TODO: show error msg
                    console.log('invalid image type');
                    return;
                }
                const reader = new FileReader();
                reader.onload = e => {
                    _this.workingSlide.image = _this.ui.slideImg.src = e.target.result;
                    _this.ui.imgFileInput.value = null;
                };
                reader.readAsDataURL(file);
                this.ui.setFilename($("#imgFilename"), `${this.curSlide.id}img.png`);
                this.data.logEvent(Slideshow.SlideshowEventType.IMAGE_ADDED, { 'source': 'computer' });
            }

            onGallerySelect(imgURL) {
                const _this = this;
                // convert the image into a base64 string
                // modified from http://stackoverflow.com/questions/6150289/how-to-convert-image-into-base64-string-using-javascript#answer-20285053
                const xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                const filename = imgURL.substr(imgURL.lastIndexOf("/") + 1);
                xhr.onload = () => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        callback(reader.result);
                    };
                    reader.readAsDataURL(xhr.response);
                };
                xhr.open('GET', imgURL);
                xhr.send();
                var callback = url64 => {
                    _this.workingSlide.image = _this.ui.slideImg.src = url64;
                    _this.ui.setFilename($("#imgFilename"), filename);
                    _this.ui.hideGallery();
                };
                this.data.logEvent(Slideshow.SlideshowEventType.IMAGE_ADDED, { 'source': 'gallery', 'filename': filename });
            }

            useWebcam() {
                const _this = this;
                const onCamReady = () => {
                    _this.ui.useWebcamBtn.disabled = true;
                    _this.ui.camVideo.classList.remove("hidden");
                    _this.ui.slideImg.classList.remove("hidden");
                    _this.webcam.showVideo();
                };
                onCamReady();
            }

            takePicture() {
                this.workingSlide.image = this.ui.slideImg.src = this.webcam.takePicture();
                this.ui.camVideo.classList.add("hidden");
                const imgName = `${this.curSlide.id}img.png`;
                this.ui.setFilename($("#imgFilename"), imgName);
                this.setState(State.Slide);
                this.data.logEvent(Slideshow.SlideshowEventType.IMAGE_ADDED, { 'source': 'camera' });
            }

            startRecording() {
                const _this = this;
                this.audio.clear();
                this.audio.record();
                this.ui.toggleRecordBtn.classList.add("active");
                let time = 0;
                this.audioTimer = setInterval(() => {
                    time += 1;
                    $("#audioTimer").text(time.toString());
                    if (time >= _this.maxAudioTime) {
                        _this.stopRecording();
                    }
                }, 1000);
            }

            stopRecording() {
                const _this = this;
                clearInterval(this.audioTimer);
                $(this.ui.recordedAudio).one('durationchange', e => {
                    _this.workingSlide.duration = Math.floor(_this.ui.recordedAudio.duration) + 1;
                    _this.ui.durationInput.value = _this.workingSlide.duration.toString();
                    const filename = `${_this.curSlide.id}audio.wav`;
                    _this.ui.setFilename($("#audioFilename"), filename);
                    _this.workingSlide.audio = _this.audio.audioBlob;
                    _this.data.logEvent(Slideshow.SlideshowEventType.AUDIO_ADDED, { 'source': 'recorded', 'length': _this.workingSlide.duration.toString() });
                });
                this.ui.toggleRecordBtn.classList.remove("active");
                this.audio.stopRecording();
            }

            addSlide() {
                const slide = new Slideshow.Slide();
                slide.id = this.show.nextId();
                this.show.addSlide(slide);
                if (this.audio) {
                    this.audio.clear();
                }
                this.ui.captionHolder.textContent = this.ui.captionInput.value = "";
                $("#imgFilename").addClass("hidden");
                $("#audioFilename").addClass("hidden");
                this.ui.slideImg.src = "";
                this.ui.durationInput.value = slide.duration.toString();
                const thumb = this.createSlideThumb(slide);
                this.setSlide(slide.id);
                if (!this.isLoadingShow) {
                    this.data.logEvent(Slideshow.SlideshowEventType.SLIDE_ADDED, { 'slide': this.curSlide.id });
                }
            }

            createSlideThumb(slide) {
                const _this = this;
                const slideThumb = new Slideshow.SlideControl();
                const thumbEl = slideThumb.getElement();
                slideThumb.id = thumbEl.id = slide.id;
                if (slide.image != undefined) {
                    slideThumb.setImageSrc(slide.image);
                }
                this.ui.slideRoll.appendChild(thumbEl);
                this.slideThumbs[slide.id] = slideThumb;
                let slideIndex = 0;
                if (this.curSlide) {
                    slideIndex = this.show.getSlideIndex(this.curSlide);
                }
                slideIndex = Math.max(slideIndex, 0);
                slideThumb.setOrder(slideIndex + 1);
                if (this.show.getLength() > slideIndex + 1) {
                    this.updateSlideOrder();
                }
                $(this.ui.slideRoll).sortable({ handle: ".slide-drag-handle" });
                $(this.ui.slideRoll).sortable("refresh");
                // jump to new slide thumb
                this.ui.slideRoll.scrollTop = this.ui.slideRoll.scrollHeight;
                $(slideThumb.getElement()).on("mouseup", e => {
                    if (_this.playback) {
                        if (_this.playback.playing) {
                            _this.playback.stop();
                        }
                        _this.playback = null;
                    }
                    _this.setSlide(slideThumb.id);
                });
                if (this.workMode == FileMode.W) {
                    slideThumb.lockBtn.on("click", e => {
                        const id = $(e.currentTarget).parent()[0].id;
                        const slide = _this.show.getSlide(id);
                        _this.ui.toggleLock($(e.currentTarget));
                        slide.locked = !slide.locked;
                        if (slide.locked) {
                            _this.data.logEvent(Slideshow.SlideshowEventType.SLIDE_LOCKED, { 'slide': id });
                        }
                        else {
                            _this.data.logEvent(Slideshow.SlideshowEventType.SLIDE_UNLOCKED, { 'slide': id });
                        }
                    });
                }
                else {
                    slideThumb.lockBtn.addClass("hidden");
                }
                slideThumb.deleteBtn.on("click", e => {
                    if (_this.workMode == FileMode.T) {
                    }
                    const id = $(e.currentTarget).parent()[0].id;
                    slideThumb.deleteModal.removeClass("hidden");
                    const onConfirm = () => {
                        _this.deleteSlide(id);
                    };
                    slideThumb.deleteConfirmBtn.on("click", onConfirm);
                    slideThumb.deleteCancelBtn.on("click", () => {
                        slideThumb.deleteModal.addClass("hidden");
                    });
                });
                slideThumb.editBtn.on("click", e => {
                    _this.workingSlide = _this.curSlide.clone();
                    _this.setState(State.Slide);
                    _this.data.logEvent(Slideshow.SlideshowEventType.SLIDE_EDITED, { 'slide': _this.curSlide.id });
                });
                slideThumb.duplicateBtn.on("click", e => {
                    const id = $(e.currentTarget).parent()[0].id;
                    _this.duplicateSlide(id);
                });
                return slideThumb;
            }

            duplicateSlide(id) {
                if (this.show.getLength() >= this.maxSlides) {
                    return null;
                }
                const slide = this.show.getSlide(id);
                const dupe = slide.clone();
                dupe.id = this.show.nextId();
                const index = this.show.getSlideIndex(slide) + 1;
                this.show.addSlideAt(dupe, index);
                this.createSlideThumb(dupe);
                this.data.logEvent(Slideshow.SlideshowEventType.SLIDE_DUPLICATED, { 'slide': id });
                return dupe;
            }

            deleteSlide(id) {
                if (this.curSlide.id == id) {
                    const curIndex = this.show.getSlideIndex(this.curSlide);
                    if (this.show.getLength() == 1) {
                        this.curSlide = null;
                    }
                    else {
                        let prevIndex = curIndex - 1;
                        prevIndex = Math.max(prevIndex, 0);
                        this.curSlide = this.show.getSlideAt(prevIndex);
                        this.setSlide(this.curSlide.id);
                    }
                }
                this.show.removeSlide(id);
                const slideThumb = this.slideThumbs[id];
                this.ui.slideRoll.removeChild(slideThumb.getElement());
                delete this.slideThumbs[id];
                this.updateSlideOrder();
                this.data.logEvent(Slideshow.SlideshowEventType.SLIDE_DELETED, { 'slide': id });
            }

            setSlide(id) {
                if (this.curThumb) {
                    this.curThumb.deselect();
                }
                this.curSlide = this.show.slides[id];
                this.curThumb = this.slideThumbs[id];
                this.curThumb.select();
                // update lock buttons for current slide
                this.ui.setEditLocks(this.curSlide.lockedFields, (this.workMode == FileMode.T));
                this.ui.captionInput.value = this.curSlide.text ? this.curSlide.text : "";
                $(this.ui.captionHolder).html(Slideshow.Utils.toHTML(this.ui.captionInput.value));
                this.ui.slideImg.src = this.curSlide.image;
                if (this.curSlide.image != "") {
                    this.ui.setFilename($("#imgFilename"), `${this.curSlide.id}img.png`);
                    $("#imgFilename").removeClass("hidden");
                }
                else {
                    $("#imgFilename").addClass("hidden");
                }
                this.audio.stop();
                if (this.curSlide.audio) {
                    this.ui.setFilename($("#audioFilename"), `${this.curSlide.id}audio.wav`);
                    $("#audioFilename").removeClass("hidden");
                    this.audio.load(this.curSlide.audio);
                    if (this.playback && this.playback.playing) {
                        this.audio.play();
                    }
                }
                else {
                    $("#audioFilename").addClass("hidden");
                    $("#audioTimer").text("0");
                }
                this.ui.durationInput.value = this.curSlide.duration.toString();
            }

            updateSlide() {
                if (this.ui.captionInput.value && this.ui.captionInput.value != this.workingSlide.text) {
                    this.workingSlide.text = this.ui.captionInput.value;
                }
                const newDuration = parseInt(this.ui.durationInput.value);
                if (this.ui.durationInput.value && newDuration != this.workingSlide.duration) {
                    this.workingSlide.duration = newDuration;
                }
                // replace original version of slide with working slide
                const index = this.show.getSlideIndex(this.curSlide);
                this.workingSlide.id = this.curSlide.id;
                this.show.removeSlide(this.curSlide.id);
                this.show.addSlideAt(this.workingSlide, index);
                this.curSlide = this.workingSlide;
                const slideThumb = this.slideThumbs[this.curSlide.id];
                slideThumb.setImageSrc(this.curSlide.image);
                slideThumb.order.text(index + 1);
            }

            saveSlides(callback) {
                const _this = this;
                const onAudioProcessed = () => {
                    document.removeEventListener('audio_processed', onAudioProcessed);
                    _this.finishSave();
                };
                document.addEventListener('audio_processed', onAudioProcessed);
                if (callback) {
                    document.addEventListener('slideshow_saved', () => {
                        callback();
                    });
                }
                this.show.prepForSave();
            }

            finishSave() {
                const name = this.ui.nameTxtInput.value ? this.ui.nameTxtInput.value : "slideshow";
                let slidesJSON = `{"name":"${name}",\n "session_id":"${this.data.session}",\n "slides": [`;
                const zip = new JSZip();
                for (let i = 0; i < this.show.slideIds.length; i++) {
                    const id = this.show.slideIds[i];
                    const slide = this.show.slides[id];
                    let imgFileName = "";
                    if (slide.imageName != undefined && slide.imageName != "" && slide.imageName != "undefined") {
                    }
                    else {
                        imgFileName = `${id}img.png`;
                    }
                    const audioFileName = `${id}audio.wav`;
                    const slideText = slide.text ? slide.text : "";
                    let slideJSON = `\n{"text": ${JSON.stringify(slideText)}`;
                    slideJSON += `, "duration": "${slide.duration}"`;
                    if (slide.image) {
                        slideJSON += `, "image": "${imgFileName}"`;
                    }
                    if (slide.audio) {
                        slideJSON += `, "audio": "${audioFileName}"`;
                    }
                    if (slide.locked) {
                        slideJSON += `, "locked": "${slide.locked}"`;
                    }
                    if (slide.hasLockedFields()) {
                        slideJSON += `, "lockedFields": [${slide.lockedFields.toString()}]`;
                    }
                    slideJSON += '}';
                    slidesJSON += slideJSON;
                    if (i < this.show.getLength() - 1) {
                        slidesJSON += ',';
                    }
                    let imgData = this.slideThumbs[id].getImageSrc();
                    if (imgData) {
                        // remove metadata from dataURL
                        imgData = imgData.substr(imgData.indexOf(',') + 1);
                        zip.file(imgFileName, imgData, { base64: true });
                    }
                    if (slide.audio) {
                        zip.file(audioFileName, slide.audioData, { binary: true });
                    }
                }
                slidesJSON += ']}';
                zip.file("slides.json", slidesJSON);
                const content = zip.generate({ type: "blob" });
                let ext;
                let eventType;
                switch (this.exportMode) {
                    case FileMode.W:
                        ext = "cssw";
                        eventType = Slideshow.SlideshowEventType.FILE_SAVED;
                        break;
                    case FileMode.T:
                        ext = "csst";
                        eventType = Slideshow.SlideshowEventType.TEMPLATE_SAVED;
                        break;
                    case FileMode.V:
                        ext = "cssv";
                        eventType = Slideshow.SlideshowEventType.SLIDESHOW_EXPORTED;
                        break;
                }
                //FileSaver.js
                const filename = `${name}.${ext}`;
                saveAs(content, filename);
                const event = new Event("slideshow_saved");
                document.dispatchEvent(event);
                this.data.logEvent(eventType, { 'filename': filename });
            }

            loadShowFile(file) {
                const _this = this;
                this.isLoadingShow = true;
                this.show = new Slideshow.Show();
                this.setState(State.Show);
                const ext = file.name.substr(file.name.lastIndexOf('.'));
                switch (ext) {
                    case ".cssw":
                        this.workMode = FileMode.W;
                        break;
                    case ".csst":
                        this.workMode = FileMode.T;
                        break;
                    case ".cssv":
                        this.workMode = FileMode.V;
                        break;
                }
                this.setWorkMode(this.workMode);
                const reader = new FileReader();
                reader.onload = e => {
                    _this.slideThumbs = {};
                    _this.ui.slideRoll.innerHTML = '';
                    const zip = new JSZip(e.target.result);
                    const dataFile = zip.files['slides.json'];
                    const slidesObj = JSON.parse(dataFile.asText());
                    _this.ui.nameTxtInput.value = slidesObj["name"];
                    const slides = slidesObj["slides"];

                    for (const slideObj of slides) {
                        _this.addSlide();
                        _this.curSlide.text = slideObj["text"] ? slideObj["text"] : "";
                        _this.curSlide.duration = slideObj["duration"];
                        if (slideObj.hasOwnProperty("image") && slideObj["image"] != "undefined" && slideObj["image"] != "") {
                            const imgName = slideObj["image"];
                            const imgFile = zip.files[imgName];
                            _this.curSlide.image = _this.curThumb.setImageSrc(`data:image/png;base64,${JSZip.base64.encode(imgFile.asBinary())}`);
                        }
                        if (slideObj.hasOwnProperty("audio") && slideObj["audio"] != "undefined") {
                            const audioFileName = slideObj["audio"];
                            const audioFile = zip.files[audioFileName];
                            const dataview = new DataView(audioFile.asArrayBuffer()); // convert from binary to ArrayBuffer?
                            _this.curSlide.audio = new Blob([dataview], { type: 'audio/wav' });
                        }
                        if (slideObj.hasOwnProperty("locked") && slideObj["locked"] == "true") {
                            _this.curSlide.locked = true;
                            _this.ui.toggleLock(_this.curThumb.lockBtn);
                            if (_this.workMode == FileMode.T) {
                                _this.curThumb.deleteBtn.addClass("disabled");
                                _this.curThumb.deleteBtn.off();
                                _this.curThumb.lockBtn.removeClass("hidden");
                                _this.curThumb.lockBtn.addClass("disabled");
                                _this.curThumb.editBtn.addClass("hidden");
                            }
                        }
                        else if (_this.workMode == FileMode.T) {
                            _this.curThumb.lockBtn.addClass("hidden");
                        }
                        if (slideObj.hasOwnProperty("lockedFields")) {
                            _this.curSlide.lockedFields = slideObj["lockedFields"];
                        }
                    }

                    _this.data.logEvent(Slideshow.SlideshowEventType.FILE_OPENED, { 'filename': slidesObj["name"], 'file_session_id': slidesObj["session_id"] });
                    _this.setSlide(_this.show.getSlideAt(0).id);
                    _this.ui.slideFileInput.value = null;
                    _this.isLoadingShow = false;
                };
                reader.readAsArrayBuffer(file);
            }

            loadShowURL(url) {
                const _this = this;
                const request = new XMLHttpRequest();
                request.open('GET', url, true);
                request.responseType = 'blob';
                request.onload = e => {
                    if (request.status == 200) {
                        const blob = new Blob([request.response]);
                        const filename = url.substring(url.lastIndexOf("/") + 1);
                        const file = Slideshow.Utils.blobToFile(blob, filename);
                        _this.loadShowFile(file);
                    }
                    else {
                        console.log(`file load error: ${e}`);
                    }
                };
                request.send();
            }

            playShow() {
                const _this = this;
                const index = this.show.getSlideIndex(this.curSlide);
                this.playback = new Slideshow.Playback(this.show, index);
                this.ui.setPauseBtn(true);
                $(document).on(Slideshow.PlaybackEvent.NEXT, () => { _this.onPlaybackNext(); });
                $(document).one(Slideshow.PlaybackEvent.FINISH, () => { _this.onPlaybackFinished(); });
                this.playback.start();
                this.setSlide(this.curSlide.id);
                this.data.logEvent(Slideshow.SlideshowEventType.SLIDESHOW_PLAYED, { 'slide': this.show.getSlideAt(this.playback.curSlide).id, 'index': index + 1 });
            }

            pauseShow() {
                const index = this.playback.curSlide;
                const slideId = this.show.getSlideAt(index).id;
                this.ui.setPauseBtn(false);
                this.playback.pause();
                if (this.audio) {
                    this.audio.stop();
                }
                this.data.logEvent(Slideshow.SlideshowEventType.SLIDESHOW_PAUSED, { 'slide': slideId, 'index': index + 1 });
            }

            resumeShow() {
                this.ui.setPauseBtn(true);
                this.playback.start();
                if (this.audio && this.curSlide.audio) {
                    this.audio.play();
                }
                const index = this.playback.curSlide;
                const slideId = this.show.getSlideAt(index).id;
                this.data.logEvent(Slideshow.SlideshowEventType.SLIDESHOW_PLAYED, { 'slide': slideId, 'index': index + 1 });
            }

            onPlaybackNext() {
                this.setSlide(this.show.getSlideAt(this.playback.curSlide).id);
            }

            onPlaybackFinished() {
                this.ui.setPauseBtn(false);
                $(document).off(Slideshow.PlaybackEvent.NEXT);
                this.playback = null;
            }
        }

        return SlideshowApp;
    })());
    Slideshow.SlideshowApp = SlideshowApp;
}))(Slideshow || (Slideshow = {}));
var Slideshow;
((Slideshow => {
    const Utils = ((() => {
        class Utils {
            // from http://stackoverflow.com/questions/979975/how-to-get-the-value-from-the-url-parameter
            static getUrlVars() {
                const vars = {};
                const parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m, key, value) => {
                    vars[key] = value;
                    return m;
                });
                return vars;
            }

            static getParentURL() {
                let url = document.referrer;
                url = url.substring(0, url.lastIndexOf("/") + 1);
                return url;
            }

            // from unplatform reporter.js
            static getCookie(cname) {
                const name = `${cname}=`;
                const ca = document.cookie.split(';');

                for (let c of ca) {
                    while (c.charAt(0) == ' ')
                        c = c.substring(1);
                    if (c.indexOf(name) == 0)
                        return c.substring(name.length, c.length);
                }

                return "";
            }

            static toHTML(val) {
                return val.replace(/(?:\r\n|\r|\n)/g, '<br>');
            }

            static fromHTML(val) {
                return val.replace(/<br\s*[\/]?>/gi, '\r\n');
            }

            // from http://stackoverflow.com/questions/27159179/how-to-convert-blob-to-file-in-javascript
            static blobToFile(theBlob, fileName) {
                const b = theBlob;
                //A Blob() is almost a File() - it's just missing the two properties below which we will add
                b.lastModifiedDate = new Date();
                b.name = fileName;
                //Cast to a File() type
                return theBlob;
            }
        }

        return Utils;
    })());
    Slideshow.Utils = Utils;
}))(Slideshow || (Slideshow = {}));
var Slideshow;
((Slideshow => {
    const Webcam = ((() => {
        class Webcam {
            constructor(stream, video, canvas) {
                const _this = this;
                this.camWidth = 384;
                this.camHeight = 288;
                console.log('new Webcam');
                this.video = video;
                this.canvas = canvas;
                this.stream = stream;
                video.muted = true;
                const browserURL = window.URL || window.webkitURL || window.mozURL || window.msURL;
                video.src = browserURL.createObjectURL(stream);
                video.addEventListener('canplay', e => {
                    if (!_this.streaming) {
                        _this.checkSizes();
                    }
                }, false);
            }

            stop() {
                console.log("webcam.stop");
                //this.stream.stop();
                this.stream.active = false;
                this.streaming = false;
            }

            start() {
                if (!this.streaming) {
                    this.stream.active = true;
                    this.streaming = true;
                }
            }

            checkSizes() {
                const onTimeUpdate = function (e) {
                    this.checkSizes();
                };
                if (this.video.videoHeight != 0 && this.video.videoWidth != 0) {
                    this.fixSizes();
                    this.video.removeEventListener('timeupdate', e => onTimeUpdate);
                }
                else {
                    // account for FireFox bug (https://bugzilla.mozilla.org/show_bug.cgi?id=926753)
                    this.video.addEventListener('timeupdate', e => onTimeUpdate, false);
                }
            }

            showVideo() {
                this.video.hidden = false;
                this.video.play();
            }

            hideVideo() {
                this.video.hidden = true;
                this.video.pause();
            }

            fixSizes() {
                this.camHeight = this.video.videoHeight / (this.video.videoWidth / this.camWidth);
                this.video.setAttribute('width', this.camWidth.toString());
                this.video.setAttribute('height', this.camHeight.toString());
                this.canvas.setAttribute('width', this.camWidth.toString());
                this.canvas.setAttribute('height', this.camHeight.toString());
                this.streaming = true;
            }

            takePicture() {
                this.canvas.width = this.camWidth;
                this.canvas.height = this.camHeight;
                const ctx = this.canvas.getContext('2d');
                ctx.save();
                ctx.scale(-1, 1);
                ctx.drawImage(this.video, this.camWidth * -1, 0, this.camWidth, this.camHeight);
                ctx.restore();
                const data = this.canvas.toDataURL('image/png');
                return data;
            }
        }

        return Webcam;
    })());
    Slideshow.Webcam = Webcam;
}))(Slideshow || (Slideshow = {}));
var Slideshow;
((Slideshow => {
    const Show = ((() => {
        class Show {
            constructor() {
                this.slideIds = [];
                this.slides = {};
                this.slideInc = 1;
            }

            nextId() {
                const id = `slide${this.slideInc.toString()}`;
                this.slideInc += 1;
                return id;
            }

            addSlide(slide) {
                this.slideIds.push(slide.id);
                this.slides[slide.id] = slide;
            }

            addSlideAt(slide, index) {
                this.slideIds.splice(index, 0, slide.id);
                this.slides[slide.id] = slide;
            }

            removeSlide(id) {
                this.slideIds.splice(this.slideIds.indexOf(id), 1);
                delete this.slides[id];
            }

            getSlide(id) {
                for (const slideId in this.slides) {
                    const slide = this.slides[slideId];
                    if (slide.id == id) {
                        return slide;
                    }
                }
                return null;
            }

            getSlideAt(index) {
                return this.slides[this.slideIds[index]];
            }

            getSlideIndex(slide) {
                return this.slideIds.indexOf(slide.id);
            }

            getLength() {
                return this.slideIds.length;
            }

            prepForSave() {
                const _this = this;
                this.totalAudioClips = 0;
                this.processedAudioClips = 0;
                for (const id in this.slides) {
                    const slide = this.slides[id];
                    if (slide.audio) {
                        this.totalAudioClips++;
                        const audioReader = new FileReader();
                        (((reader, j) => {
                            reader.addEventListener('loadend', () => {
                                _this.slides[j].audioData = reader.result;
                                _this.processedAudioClips++;
                                if (_this.processedAudioClips === _this.totalAudioClips) {
                                    const event = new Event('audio_processed');
                                    document.dispatchEvent(event);
                                }
                            });
                        }))(audioReader, id);
                        audioReader.readAsArrayBuffer(slide.audio);
                    }
                }
                if (this.totalAudioClips == 0) {
                    const event = new Event('audio_processed');
                    document.dispatchEvent(event);
                }
            }
        }

        return Show;
    })());
    Slideshow.Show = Show;
    ((SlideField => {
        SlideField[SlideField["Image"] = 0] = "Image";
        SlideField[SlideField["Audio"] = 1] = "Audio";
        SlideField[SlideField["Caption"] = 2] = "Caption";
        SlideField[SlideField["Duration"] = 3] = "Duration";
    }))(Slideshow.SlideField || (Slideshow.SlideField = {}));
    const SlideField = Slideshow.SlideField;
    const Slide = ((() => {
        class Slide {
            constructor() {
                this.image = "";
                this.imageName = "";
                this.text = "";
                this.lockedFields = [];
                this.duration = 6;
                this.lockedFields[SlideField.Image] = false;
                this.lockedFields[SlideField.Audio] = false;
                this.lockedFields[SlideField.Caption] = false;
                this.lockedFields[SlideField.Duration] = false;
            }

            hasLockedFields() {
                const val = this.lockedFields[SlideField.Image] ||
                    this.lockedFields[SlideField.Audio] ||
                    this.lockedFields[SlideField.Caption] ||
                    this.lockedFields[SlideField.Duration];
                return val;
            }

            clone() {
                const clone = new Slide();
                clone.image = this.image;
                clone.text = this.text;
                clone.audio = this.audio;
                clone.audioData = this.audioData;
                clone.locked = this.locked;
                clone.lockedFields = this.lockedFields.slice();
                clone.duration = this.duration;
                return clone;
            }
        }

        return Slide;
    })());
    Slideshow.Slide = Slide;
}))(Slideshow || (Slideshow = {}));
var Slideshow;
((Slideshow => {
    const UI = ((() => {
        class UI {
            constructor(content) {
                this.content = content;
                this.slideRoll = $('#slideRoll')[0];
                this.slideEditor = $('#slideEditor')[0];
                this.nameTxtInput = document.getElementById('nameTxtInput');
                this.slideImg = document.getElementById('slideImg');
                this.captionHolder = document.getElementById('captionHolder');
                this.captionInput = document.getElementById('captionInput');
                this.durationInput = document.getElementById('durationInput');
                this.loadPictureBtn = document.getElementById('loadPictureBtn');
                this.useWebcamBtn = document.getElementById('useWebcamBtn');
                this.takePictureBtn = document.getElementById('takePictureBtn');
                this.deleteImgBtn = document.getElementById('deleteImgBtn');
                this.recordAudioBtn = document.getElementById('recordAudioBtn');
                this.toggleRecordBtn = document.getElementById('toggleRecordBtn');
                this.deleteAudioBtn = document.getElementById('deleteAudioBtn');
                this.recordedAudio = document.getElementById('recordedAudio');
                this.saveShowBtn = document.getElementById('saveShowBtn');
                this.exportShowBtn = document.getElementById('exportShowBtn');
                this.loadShowBtn = document.getElementById('loadShowBtn');
                this.addSlideBtn = document.getElementById('addSlideBtn');
                this.deleteSlideBtn = document.getElementById('deleteSlideBtn');
                this.newShowBtn = document.getElementById('newShowBtn');
                this.playShowBtn = document.getElementById('playShowBtn');
                this.imgFileInput = document.getElementById('imgFileInput');
                this.slideFileInput = document.getElementById('slideFileInput');
                this.camVideo = document.getElementById('camVideo');
                this.camCanvas = document.getElementById('camCanvas');
                this.controlElements = document.getElementsByClassName('controls');
                this.hideDialog();
            }

            hideEditControls() {
                for (const el of this.controlElements) {
                    el.classList.add('hidden');
                }
            }

            showEditControls() {
                for (const el of this.controlElements) {
                    el.classList.remove('hidden');
                }
            }

            clearAll() {
                this.nameTxtInput.value = "";
            }

            showDialog(message, buttons) {
                const _this = this;
                $("#dialogWrapper").removeClass("hidden");
                $("#dialogMsg").html(message);
                $("#dialogBtns").empty();
                buttons.forEach(btnDef => {
                    const btn = $("<button>")
                        .text(btnDef.text)
                        .addClass("textBtn");
                    $("#dialogBtns")
                        .append(btn);
                    ((callback => {
                        btn.on("click", () => {
                            callback();
                            _this.hideDialog();
                        });
                    }))(btnDef.fn);
                });
            }

            hideDialog() {
                $("#dialogWrapper").addClass("hidden");
            }

            setEditLocks(locks, templateMode) {
                this.setLock($("#lockImgBtn"), locks[Slideshow.SlideField.Image], templateMode);
                if (locks[Slideshow.SlideField.Image] && templateMode) {
                    $("#loadPictureBtn").addClass("hidden");
                    $("#useWebcamBtn").addClass("hidden");
                    $("#deleteImgBtn").addClass("hidden");
                }
                else {
                    $("#loadPictureBtn").removeClass("hidden");
                    $("#useWebcamBtn").removeClass("hidden");
                    $("#deleteImgBtn").removeClass("hidden");
                }
                this.setLock($("#lockAudioBtn"), locks[Slideshow.SlideField.Audio], templateMode);
                if (locks[Slideshow.SlideField.Audio] && templateMode) {
                    $("#recordAudioBtn").addClass("hidden");
                    $("#loadAudioBtn").addClass("hidden");
                    $("#deleteAudioBtn").addClass("hidden");
                }
                else {
                    $("#recordAudioBtn").removeClass("hidden");
                    $("#loadAudioBtn").removeClass("hidden");
                    $("#deleteAudioBtn").removeClass("hidden");
                }
                this.setLock($("#lockCaptionBtn"), locks[Slideshow.SlideField.Caption], templateMode);
                if (locks[Slideshow.SlideField.Caption] && templateMode) {
                    $("#captionInput").addClass("disabled");
                    $("#captionInput").attr("readonly", "readonly");
                }
                else {
                    $("#captionInput").removeClass("disabled");
                    $("#captionInput").removeAttr("readonly");
                }
                this.setLock($("#lockDurationBtn"), locks[Slideshow.SlideField.Duration], templateMode);
                if (locks[Slideshow.SlideField.Duration] && templateMode) {
                    $("#durationInput").addClass("disabled");
                    $("#durationInput").attr("readonly", "readonly");
                }
                else {
                    $("#durationInput").removeClass("disabled");
                    $("#durationInput").removeAttr("readonly");
                }
            }

            setLock(button, val, templateMode) {
                if (templateMode) {
                    button.addClass("disabled");
                }
                else {
                    button.removeClass("disabled");
                }
                if (val) {
                    button.children("i")
                        .addClass("fa-lock")
                        .removeClass("fa-unlock-alt");
                }
                else {
                    button.children("i")
                        .addClass("fa-unlock-alt")
                        .removeClass("fa-lock");
                }
            }

            toggleLock(button) {
                button.children("i")
                    .toggleClass("fa-unlock-alt")
                    .toggleClass("fa-lock");
            }

            togglePlayBtn() {
                $("#playShowBtn").children("i")
                    .toggleClass("fa-play")
                    .toggleClass("fa-pause");
            }

            setPauseBtn(showPause) {
                if (showPause) {
                    $("#playShowBtn").children("i")
                        .removeClass("fa-play")
                        .addClass("fa-pause");
                }
                else {
                    $("#playShowBtn").children("i")
                        .removeClass("fa-pause")
                        .addClass("fa-play");
                }
            }

            showGallery() {
                $("#gallery").removeClass("hidden");
            }

            hideGallery() {
                $("#gallery").addClass("hidden");
            }

            setFilename(selection, name) {
                selection
                    .removeClass("hidden")
                    .children("span")
                    .text(name);
            }
        }

        return UI;
    })());
    Slideshow.UI = UI;
}))(Slideshow || (Slideshow = {}));
//# sourceMappingURL=slideshowApp.js.map