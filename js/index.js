
                  
                 
                  var multiItemSlider = (function () {
              
                    function _isElementVisible(element) {
                      
                      var rect = element.getBoundingClientRect(),
                        vWidth = window.innerWidth || doc.documentElement.clientWidth,
                        vHeight = window.innerHeight || doc.documentElement.clientHeight,
                        elemFromPoint = function (x, y) { return document.elementFromPoint(x, y) };
                      if (rect.right < 0 || rect.bottom < 0
                        || rect.left > vWidth || rect.top > vHeight)
                        return false;
                      return (
                        element.contains(elemFromPoint(rect.left, rect.top))
                        || element.contains(elemFromPoint(rect.right, rect.top))
                        || element.contains(elemFromPoint(rect.right, rect.bottom))
                        || element.contains(elemFromPoint(rect.left, rect.bottom))
                      );
                    }
              
                    return function (selector, config) {
                      
                      var
                        _mainElement = document.querySelector(selector),
                        _sliderWrapper = _mainElement.querySelector('.slider__wrapper'),
                        _sliderItems = _mainElement.querySelectorAll('.slider__item'),
                        _sliderControls = _mainElement.querySelectorAll('.slider__control'),
                        _sliderControlLeft = _mainElement.querySelector('.slider__control_left'),
                        _sliderControlRight = _mainElement.querySelector('.slider__control_right'),
                        _wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width),
                        _itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width),
                        _html = _mainElement.innerHTML,
                        _positionLeftItem = 0,
                        _transform = 0,
                        _step = _itemWidth / _wrapperWidth * 110,
                        _items = [],
                        _interval = 0,
                        _states = [
                          { active: false, minWidth: 0, count: 1 },
                          { active: false, minWidth: 576, count: 2 },
                          { active: false, minWidth: 992, count: 3 },
                          { active: false, minWidth: 1200, count: 4 },
                        ],
                        _config = {
                          isCycling: false,
                          direction: 'right',
                          interval: 5000,
                          pause: true
                        };
              
                      for (var key in config) {
                        if (key in _config) {
                          _config[key] = config[key];
                        }
                      }
              
                      _sliderItems.forEach(function (item, index) {
                        _items.push({ item: item, position: index, transform: 0 });
                      });
              
                      var _setActive = function () {
                        var _index = 0;
                        var width = parseFloat(document.body.clientWidth);
                        _states.forEach(function (item, index, arr) {
                          _states[index].active = false;
                          if (width >= _states[index].minWidth)
                            _index = index;
                        });
                        _states[_index].active = true;
                      }
              
                      var _getActive = function () {
                        var _index;
                        _states.forEach(function (item, index, arr) {
                          if (_states[index].active) {
                            _index = index;
                          }
                        });
                        return _index;
                      }
              
                      var position = {
                        getItemMin: function () {
                          var indexItem = 0;
                          _items.forEach(function (item, index) {
                            if (item.position < _items[indexItem].position) {
                              indexItem = index;
                            }
                          });
                          return indexItem;
                        },
                        getItemMax: function () {
                          var indexItem = 0;
                          _items.forEach(function (item, index) {
                            if (item.position > _items[indexItem].position) {
                              indexItem = index;
                            }
                          });
                          return indexItem;
                        },
                        getMin: function () {
                          return _items[position.getItemMin()].position;
                        },
                        getMax: function () {
                          return _items[position.getItemMax()].position;
                        }
                      }
              
                      var _transformItem = function (direction) {
                    
                        var nextItem;
                        if (!_isElementVisible(_mainElement)) {
                          return;
                        }
                        if (direction === 'right') {
                          stapOpacity("right");
                          _positionLeftItem++;
                          if ((_positionLeftItem + _wrapperWidth / _itemWidth - 1) > position.getMax()) {
                            nextItem = position.getItemMin();
                            _items[nextItem].position = position.getMax() + 1;
                            _items[nextItem].transform += _items.length * 100;
                            _items[nextItem].item.style.transform = 'translateX(' + _items[nextItem].transform + '%)';
                          }
                          _transform -= _step;
                         
                          
                        }
                        if (direction === 'left') {
                          stapOpacity("left");
                          _positionLeftItem--;
                          if (_positionLeftItem < position.getMin()) {
                            nextItem = position.getItemMax();
                            _items[nextItem].position = position.getMin() - 1;
                            _items[nextItem].transform -= _items.length * 100;
                            _items[nextItem].item.style.transform = 'translateX(' + _items[nextItem].transform + '%)';
                          }
                          _transform += _step;
                         
                         
                        }
                        _sliderWrapper.style.transform = 'translateX(' + _transform + '%)';
                      }
              
                      var _cycle = function (direction) {
                        if (!_config.isCycling) {
                          return;
                        }
                        _interval = setInterval(function () {
                          _transformItem(direction);
                        }, _config.interval);
                      }
              
                      var _controlClick = function (e) {
                        
                        if (e.target.classList.contains('slider__control')) {
                          e.preventDefault();
                          var direction = e.target.classList.contains('slider__control_right') ? 'right' : 'left';
                          _transformItem(direction);
                          clearInterval(_interval);
                          _cycle(_config.direction);
                        }
                      };
                      /*var _pointerDown = function (e) {
                       
                       
                      };*/
              
                      var _handleVisibilityChange = function () {
                        if (document.visibilityState === "hidden") {
                          clearInterval(_interval);
                        } else {
                          clearInterval(_interval);
                          _cycle(_config.direction);
                        }
                      }
              
                      var _refresh = function () {
                       // console.log("refrash");
                       // addOpacity();
                        clearInterval(_interval);
                        _mainElement.innerHTML = _html;
                        _sliderWrapper = _mainElement.querySelector('.slider__wrapper');
                        _sliderItems = _mainElement.querySelectorAll('.slider__item');
                        _sliderControls = _mainElement.querySelectorAll('.slider__control');
                        _sliderControlLeft = _mainElement.querySelector('.slider__control_left');
                        _sliderControlRight = _mainElement.querySelector('.slider__control_right');
                        _wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width);
                        _itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width);
                        _positionLeftItem = 0;
                        _transform = 0;
                        _step = _itemWidth / _wrapperWidth * 110;
                        _items = [];
                        _sliderItems.forEach(function (item, index) {

                          if(index==1){
                            item.classList.add("slider-active");
                          }
                          
                          _items.push({ item: item, position: index, transform: 0 });
                        });
                      }
              
                      var _setUpListeners = function () {
                        _mainElement.addEventListener('click', _controlClick);


                        //document.querySelector(".container").addEventListener('pointerdown',function(event){ _pointerDown(event);},false);
                       
                       
                        if (_config.pause && _config.isCycling) {
                          _mainElement.addEventListener('mouseenter', function () {
                            clearInterval(_interval);
                          });
                          _mainElement.addEventListener('mouseleave', function () {
                            clearInterval(_interval);
                            _cycle(_config.direction);
                          });
                        }
                       
                        document.addEventListener('visibilitychange', _handleVisibilityChange, false);
                        window.addEventListener('resize', function () {
                         
                          
                          var
                            _index = 0,
                            width = parseFloat(document.body.clientWidth),
                            mainContainer=document.querySelector(".container");

                          

                          _states.forEach(function (item, index, arr) {
                            if (width >= _states[index].minWidth)
                               
                              _index = index;
                              
                          });
                          console.log("проверим", _index, _getActive());
                          if (_index !== _getActive()) {
                              
                            _setActive();
                            _refresh();
                          }
                          if (_index == 0) {
                              
                            mainContainer.classList.add("swipe");
                           
                            //var sliderSwap = swipeSlider('.swipe');
                          }else{
                            mainContainer.classList.remove("swipe");
                           
                          }

                        });
                       
                      }
              
                      // инициализация
                      _setUpListeners();
                      if (document.visibilityState === "visible") {
                            addOpacity();
                       
                        _cycle(_config.direction);
                      }
                      _setActive();
              
                      return {
                        right: function () {
                          _transformItem('right');
                        },
                        left: function () {
                          _transformItem('left');
                        },
                        stop: function () {
                          _config.isCycling = false;
                          clearInterval(_interval);
                        },
                        cycle: function () {
                          _config.isCycling = true;
                          clearInterval(_interval);
                          _cycle();
                        }
                      }
              
                    }
                  }());             
                  var slider = multiItemSlider('.slider', {
                    isCycling: true
                  });
                  
                  var swipeSlider = (function () {
                     
                    return function (selector, config) {
                      
                      let sliderSwap = document.querySelector(selector),
                      sliderList = sliderSwap.querySelector('.slider'),
                      sliderTrack = sliderSwap.querySelector('.slider__wrapper'),
                      slidesItem = sliderSwap.querySelectorAll('.slider__item'),
                      arrows = sliderSwap.querySelector('.slider__control'),
                     
                      slideWidth = slidesItem[0].offsetWidth,
                      slideIndex = 0,
                      posInit = 0,
                      posX1 = 0,
                      posX2 = 0,
                      posY1 = 0,
                      posY2 = 0,
                      posFinal = 0,
                      isSwipe = false,
                      isScroll = false,
                      allowSwipe = true,
                      transition = true,
                      nextTrf = 0,
                      prevTrf = 0,
                      lastTrf = --slidesItem.length * slideWidth,
                      posThreshold = slidesItem[0].offsetWidth * 0.35,
                      trfRegExp = /([-0-9.]+(?=px))/,
                      swipeStartTime,
                      swipeEndTime,
                      getEvent = function() {
                        return (event.type.search('touch') !== -1) ? event.touches[0] : event;
                      },
                      slide = function() {
                        if (transition) {
                          sliderTrack.style.transition = 'transform .8s';
                        }
                        sliderTrack.style.transform = `translate3d(-${slideIndex * slideWidth}px, 0px, 0px)`;
                    
                       
                      },
                      swipeStart = function() {
                        let evt = getEvent();
                    
                        if (allowSwipe) {
                    
                          swipeStartTime = Date.now();
                          
                          transition = true;
                    
                          nextTrf = (slideIndex + 1) * -slideWidth;
                          prevTrf = (slideIndex - 1) * -slideWidth;
                    
                          posInit = posX1 = evt.clientX;
                          posY1 = evt.clientY;
                    
                          sliderTrack.style.transition = '';
                    
                          document.addEventListener('touchmove', swipeAction);
                          document.addEventListener('mousemove', swipeAction);
                          document.addEventListener('touchend', swipeEnd);
                          document.addEventListener('mouseup', swipeEnd);
                          

                          sliderList.classList.remove('grab');
                          sliderList.classList.add('grabbing');
                        }
                      },
                      swipeAction = function() {
                        
                        let evt = getEvent(),
                          style = sliderTrack.style.transform,
                          transform = +style.match(trfRegExp)[0];
                    
                        posX2 = posX1 - evt.clientX;
                        posX1 = evt.clientX;
                    
                        posY2 = posY1 - evt.clientY;
                        posY1 = evt.clientY;
                    
                        if (!isSwipe && !isScroll) {
                          let posY = Math.abs(posY2);
                          if (posY > 7 || posX2 === 0) {
                            isScroll = true;
                            allowSwipe = false;
                          } else if (posY < 7) {
                            isSwipe = true;
                          }
                        }
                    
                        if (isSwipe) {
                          if (slideIndex === 0) {
                            if (posInit < posX1) {
                              setTransform(transform, 0);
                              return;
                            } else {
                              allowSwipe = true;
                            }
                          }
                    
                          // запрет ухода вправо на последнем слайде
                          if (slideIndex === --slidesItem.length) {
                            if (posInit > posX1) {
                              setTransform(transform, lastTrf);
                              return;
                            } else {
                              allowSwipe = true;
                            }
                          }
                    
                          if (posInit > posX1 && transform < nextTrf || posInit < posX1 && transform > prevTrf) {
                            reachEdge();
                            return;
                          }
                    
                          sliderTrack.style.transform = `translate3d(${transform - posX2}px, 0px, 0px)`;
                        }
                    
                      },
                      swipeEnd = function() {
                        posFinal = posInit - posX1;
                    
                        isScroll = false;
                        isSwipe = false;
                    
                        document.removeEventListener('touchmove', swipeAction);
                        document.removeEventListener('mousemove', swipeAction);
                        document.removeEventListener('touchend', swipeEnd);
                        document.removeEventListener('mouseup', swipeEnd);
                    
                        sliderList.classList.add('grab');
                        sliderList.classList.remove('grabbing');
                    
                        if (allowSwipe) {
                          swipeEndTime = Date.now();
                          if (Math.abs(posFinal) > posThreshold || swipeEndTime - swipeStartTime < 300) {
                            if (posInit < posX1) {
                              slideIndex--;
                            } else if (posInit > posX1) {
                              slideIndex++;
                            }
                          }
                    
                          if (posInit !== posX1) {
                            allowSwipe = false;
                            slide();
                          } else {
                            allowSwipe = true;
                          }
                    
                        } else {
                          allowSwipe = true;
                        }
                    
                      },
                      setTransform = function(transform, comapreTransform) {
                        if (transform >= comapreTransform) {
                          if (transform > comapreTransform) {
                            sliderTrack.style.transform = `translate3d(${comapreTransform}px, 0px, 0px)`;
                          }
                        }
                        allowSwipe = false;
                      },
                      reachEdge = function() {
                        transition = false;
                        swipeEnd();
                        allowSwipe = true;
                      };
                    
                    sliderTrack.style.transform = 'translate3d(0px, 0px, 0px)';
                    sliderList.classList.add('grab');
                    
                    sliderTrack.addEventListener('transitionend', () => allowSwipe = true);
                    sliderSwap.addEventListener('touchstart', swipeStart);
                    sliderSwap.addEventListener('mousedown', swipeStart);
                    
                    };

                  }());
                 
                 // var sliderSwap = swipeSlider('.swap');
                 
                 
                  var popupSlider = (function () {
                   
                    return function (selector,index, positionSlide, config) {
                      
                      var
                        _mainElement = document.querySelector(selector), // основный элемент блока
                        _sliderWrapper = _mainElement.querySelector('.popup__containerItem'), // обертка для .slider-item
                        _sliderItems = _mainElement.querySelectorAll('.popup__content'), // элементы (.slider-item)
                        _sliderControls = _mainElement.querySelectorAll('.popup__navarrow'), // элементы управления
                        _sliderControlLeft = _mainElement.querySelector('.popup__navarrow_left'), // кнопка "LEFT"
                        _sliderControlRight = _mainElement.querySelector('.popup__navarrow_right'), // кнопка "RIGHT"
                        _wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width), // ширина обёртки
                        _itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width), // ширина одного элемента    
                        _positionLeftItem = index, // позиция левого активного элемента
                        _transform = positionSlide, // значение транфсофрмации .slider_wrapper
                        _step = _itemWidth / _wrapperWidth * 200, // величина шага (для трансформации)
                        _items = []; // массив элементов
                      // наполнение массива _items
                     // console.log(_transform);
                      _sliderItems.forEach(function (item, index) {
                      
                        _items.push({ item: item, position: index, transform: 0 });
                      });
                
                      var position = {
                        getMin: 0,
                        getMax: _items.length - 1,
                      }
                
                      var _transformItem = function (direction) {
                       
                        if (direction === 'right') {
                          
                          if ((_positionLeftItem + _wrapperWidth / _itemWidth - 1) >= position.getMax) {
                           
                            return;
                          }
                          if (!_sliderControlLeft.classList.contains('popup__control_show')) {
                            _sliderControlLeft.classList.add('popup__control_show');
                          }
                          if (_sliderControlRight.classList.contains('popup__control_show') && (_positionLeftItem + _wrapperWidth / _itemWidth) >= position.getMax) {
                            _sliderControlRight.classList.remove('popup__control_show');
                          }
                        
                          _positionLeftItem++;
                          _transform += _step;
                          
                        }
                        if (direction === 'left') {
                         
                          if (_positionLeftItem <= position.getMin) {
                           
                            return;
                          }
                          if (!_sliderControlRight.classList.contains('popup__control_show')) {
                            _sliderControlRight.classList.add('popup__control_show');
                          }
                          if (_sliderControlLeft.classList.contains('popup__control_show') && _positionLeftItem - 1 <= position.getMin) {
                            _sliderControlLeft.classList.remove('popup__control_show');
                          }
                       
                          _positionLeftItem--;
                          _transform -= _step;
                        }
                        console.log("trans",_transform);
                        _sliderWrapper.style.transform = 'translateX(-' + _transform + '%)';
                      }
                
                      // обработчик события click для кнопок "назад" и "вперед"
                      var _controlClick = function clickPopup (e) {
                      
                      
                        if (e.target.classList.contains('popup__navarrow')) {
                          e.preventDefault();
                          var direction = e.target.classList.contains('popup__navarrow_right') ? 'right' : 'left';
                          _transformItem(direction);
                        }
                      };
                      
                      var _setUpListeners = function () {
                        // добавление к кнопкам "назад" и "вперед" обрботчика _controlClick для событя click
                      
                        _sliderControls.forEach(function (item) {
                         
                       
                          addEventListener('click',_controlClick);
                         
                        });
                      }
                
                      // инициализация
                      _setUpListeners();
                
                      return {
                        right: function () { // метод right
                          _transformItem('right');
                        },
                        left: function () { // метод left
                          _transformItem('left');
                        }
                      }
                
                    }
                  }());
                
                  
                 
                  function closePopup(index){
                      if(index){
                       
                        var popUp = document.getElementById("popup");
                        popUp.classList.remove("open");
                        var _mainElement = document.querySelector(".popup__body");
                        var _sliderControls = _mainElement.querySelectorAll('.popup__navarrow');
                      
                        _sliderControls.forEach(function (item) {
                          
                          item.removeEventListener("click",clickPopup);
                        });
                        
                      
                    }
                  }
                 
                  function showLightbox(index) {
                    var mainPopupBlock =document.getElementById("popup");
                    var sliderItems = mainPopupBlock.querySelectorAll('.popup__content'); // элементы (.slider-item)
                    var popupMainElement = document.querySelector(".popup__body"); // основный элемент блока
                    var popupWrapper = popupMainElement.querySelector('.popup__containerItem'); // обертка для .slider-ite
                    var popupNavLeft = popupMainElement.querySelector('.popup__navarrow_left');
                    var popupNavRight = popupMainElement.querySelector('.popup__navarrow_right');
                    var wrapperWidth = parseFloat(getComputedStyle(popupWrapper).width); // ширина обёртки
                    var itemWidth = parseFloat(getComputedStyle(sliderItems[0]).width); // ширина одного элемента   
                    var stap= itemWidth / wrapperWidth * 200;
                    var positionSlide=stap*index;

                    var sliderPopup = popupSlider('.popup__body', index, positionSlide);
                    //var stap   = 163;
                    if(index==0){
                     
                      popupNavRight.classList.add("popup__control_show");
                      popupNavLeft.classList.remove("popup__control_show");
                    
                      
                    }else if(index==8){
                    
                      
                      popupNavLeft.classList.add("popup__control_show");
                      popupNavRight.classList.remove("popup__control_show");
                     
                      
                    }else{
                      
                      popupNavLeft.classList.add("popup__control_show");
                      popupNavRight.classList.add("popup__control_show");
                     
                    }
                    
                 
                    popupWrapper.style.transform = 'translateX(-' + positionSlide + '%)'; 
                    mainPopupBlock.classList.add("open");
                    mainPopupBlock.addEventListener("click",function(e){
                      
                    if(!e.target.closest('.popup__wrapper') && !e.target.classList.contains("popup__navarrow")){
                      closePopup(e.target.closest(".popup"));
                    }
                  });

                  
                  }
                 
                  function addOpacity(){
                   
                    var addOpacity = document.getElementsByClassName("slider__item");
                        for (var i = 0; i < addOpacity.length; i++) {
                            addOpacity[1].classList.add("slider-active");
                        }
                  }
                 
                  function stapOpacity(option){
                    console.log("option", option);
                    var activeItem = document.querySelector(".slider__item.slider-active");
                    var allActiveItem = document.querySelectorAll(".slider__item");
                    if(activeItem){
                      if(option=="right"){
                   
                            
                              var nextItem = activeItem.nextElementSibling;
                             
                              if(nextItem==null){
                                nextItem=allActiveItem[0];
                              }
                              activeItem.classList.remove("slider-active");
                              nextItem.classList.add("slider-active");
                          }
                   else if(option=="left"){
                    
                            
                                var prevItem = activeItem.previousElementSibling;
                                if(prevItem==null){
                                  prevItem=allActiveItem[8];
                                }
                            
                                activeItem.classList.remove("slider-active");
                                prevItem.classList.add("slider-active");
                                  

                    }
                  }
                }
                


                 
                 