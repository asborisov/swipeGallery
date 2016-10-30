/**
 * Created by Артём on 29.10.2016.
 */
(function() {
	const selectors = {
		galleryWrapper: 'gallery-wrapper',
		swipeWrapper: 'swipe-wrapper',
		galleryElement: 'gallery-element'
	};
	const transitionTimeout = 0.2;
	const changeCb = [];

	let elementWidth;
	let swipeWidth;
	let swipe;
	let gallery;

	let touchStartPos;
	let lastMovePos;
	let position;
	let lastTouchPosition = 0;
	let current = 0;
	let removeTranslateTimeout;

	function init() {
		const elements = document.getElementsByClassName(selectors.galleryElement);

		elementWidth = elements[0].offsetWidth;
		swipeWidth = elementWidth * (elements.length - 1);
		swipe = document.getElementsByClassName(selectors.swipeWrapper)[0];
		gallery = document.getElementsByClassName(selectors.galleryWrapper)[0];

		gallery.addEventListener('touchstart', touchStart);
		gallery.addEventListener('touchmove', touchMove);
		gallery.addEventListener('touchend', touchEnd);

		changeCb.push(e => console.log(e));
	}

	init();

	function touchStart(e) {
		touchStartPos = e.touches[0].pageX;
		position = 0;
		lastMovePos = e.touches[0].pageX;
	}

	function touchMove(e) {
		e.preventDefault();
		lastMovePos = e.touches[0].pageX;
		let delta = lastTouchPosition + touchStartPos - e.touches[0].pageX;
		position = delta > 0 ? delta : 0;
		if (position == lastTouchPosition) return;
		if (position > swipeWidth) {
			position = swipeWidth;
		}
		updateTranslate(position);
	}

	function touchEnd() {
		let movedTo = touchStartPos - lastMovePos;
		if (Math.abs(movedTo) < elementWidth / 3) {
			scrollTo(current);
			return;
		}
		if (movedTo > 0) {
			scrollTo(current + 1);
		} else {
			scrollTo(current - 1);
		}
	}

	function updateTranslate(pos) {
		setSwipeStyle('transform', `translate3d(-${pos}px,0,0)`);
	}

	function scrollTo(index) {
		setSwipeStyle('transition', `transform ${transitionTimeout}s ease-in-out`);
		current = index;
		const scrollLeft = index * elementWidth;
		updateTranslate(scrollLeft);
		lastTouchPosition = scrollLeft;
		changeCb.forEach(cb => cb(index));
		if (removeTranslateTimeout) clearTimeout(removeTranslateTimeout);
		removeTranslateTimeout = setTimeout(() => {
			setSwipeStyle('transition');
		}, transitionTimeout*1000);
	}

	function setSwipeStyle(style, value) {
		swipe.style[style] = value;
	}
})();