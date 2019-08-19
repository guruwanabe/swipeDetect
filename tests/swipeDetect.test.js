function mouseMove(element, fromX, fromY, toX, toY){
    var eventStart  = new MouseEvent('mousedown', {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: fromX,
        clientY: fromY
    });
    var eventEnd = new MouseEvent('mousemove', {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: toX,
        clientY: toY
    });

    document.querySelector('body').dispatchEvent(eventStart);
    document.querySelector('body').dispatchEvent(eventEnd);
}

QUnit.module("swipeDetect.js",{
        setup: function(){
            this.container = $('#qunit-fixture');
            this.container.after('<div id="testDiv" style="height: 1000px;"></div>');
            this.element = document.querySelector('#testDiv');
            this.swipeDetect = new SwipeDetect();
        }
    }
);

QUnit.test("swipeRight", function (assert) {
    assert.expect(1);
    const done = assert.async();

    //Given
    this.element.addEventListener("swipeRight.sd", function (e) {
        //Then
        assert.ok(e.type, 'swipeRight.sd');
        done();
    }, false);

    //When
    mouseMove(this.element, 20, 20, 100, 20);
});

QUnit.test("swipeLeft", function (assert) {
    assert.expect(1);
    const done = assert.async();
    //Given
    this.element.addEventListener("swipeLeft.sd", function (e) {
        //Then
        assert.ok(e.type, 'swipeLeft.sd');
        done();
    }, false);

    //When
    mouseMove(this.element, 20, 20, -100, 20);
});

QUnit.test("swipeUp", function (assert) {
    assert.expect(1);
    const done = assert.async();

    //Given
    this.swipeDetect.settings.verticalSwipe = true;
    this.element.addEventListener("swipeUp.sd", function (e) {
        //Then
        assert.ok(e.type, 'swipeUp.sd');
        done();
    }, false);

    //When
    mouseMove(this.element, 20, 20, 20, -100);
});

QUnit.test("swipeDown", function (assert) {
    assert.expect(1);
    const done = assert.async();

    //Given
    this.swipeDetect.settings.verticalSwipe = true;
    this.element.addEventListener("swipeDown.sd", function (e) {
        //Then
        assert.ok(e.type, 'swipeDown.sd');
        done();
    }, false);

    //When
    mouseMove(this.element, 20, 20, 20, 100);
});

QUnit.test("onBeforeSwipe", function (assert) {
    assert.expect(1);
    const done = assert.async();

    //Given
    this.swipeDetect.settings.onBeforeSwipe = function (element) {
        element.classList.add('onBeforeSwipe');
    };
    
    this.element.addEventListener("swipeLeft.sd", function (e) {
        //Then
        assert.ok(e.target.classList.contains('onBeforeSwipe'), true);
        done();
    }, false);

    //When
    mouseMove(this.element, 20, 20, -100, 20);
});

QUnit.test("onAfterSwipe", function (assert) {
    assert.expect(1);
    const done = assert.async();

    //Given
    this.swipeDetect.settings.onAfterSwipe = function (element) {
        element.classList.add('onAfterSwipe');
    };

    this.element.addEventListener("swipeLeft.sd", function (e) {
        //Then
        setTimeout(function () {
            assert.ok(e.target.classList.contains('onAfterSwipe'), true);
            done();
        }, 10)
    }, false);

    //When
    mouseMove(this.element, 20, 20, -100, 20);
});
