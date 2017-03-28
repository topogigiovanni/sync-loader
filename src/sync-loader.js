;
(function($, window, document, undefined) {

	'use strict';

	var $body;
	var $scripts;

	var phase = {
		number: 1,
		loadedCount: null,
		toLoadCount: null,
		started: false,
		finished: false
	};

	function checkPhaseCompleted() {
		console.log('cloaded', arguments);
	}

	function bindScriptOnLoad() {
		$scripts.on('load', checkPhaseCompleted);
	}

	function run() {
		$scripts.each(function() {
			var src = $(this).data('sync-loader');
			$(this).attr('src', src);
		});
	}

	function init() {

		// define vars
		$body = $('body');
		$scripts = $('[data-sync-loader]');
		console.debug($scripts);

		// login
		bindScriptOnLoad();
		run();

	}

	$(document).ready(init);

})(jQuery, window, document);
