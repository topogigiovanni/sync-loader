/*
 *  syncLoader - v0.1.0
 *  jQuery plugin to load scripts in a synchronized way.
 *  https://github.com/topogigiovanni/syncLoader
 *
 *  Made by Giovanni Mansueto
 *  Under MIT License
 */
(function($, window, document, undefined) {

	'use strict';

	var $document;
	var $scripts;

	var phase = {
		number: 1,
		loadedCount: 0,
		toLoadCount: 0,
		started: false,
		finished: false
	};

	function checkPhaseCompleted() {
		phase.loadedCount++;
		if (phase.loadedCount === phase.toLoadCount) {
			finishPhase();
		}
	}

	function bindScriptOnLoad() {
		$scripts.on('load', function() {
			$(this).addClass('sync-loaded');
			checkPhaseCompleted();
		});
	}

	function trigger(number) {
		$document.trigger('syncloader.phase.' + number);
	}

	function loadScripts($scripts) {
		if (!!window['smartRequire']) {
			// smartRequire load mode
			var srcList = [];
			$scripts
				.each(function() {
					srcList.push({
						url: $(this).data('sync-loader')
					});
				});

			smartRequire
				.require
				.apply(smartRequire, srcList)
				.then(function() {
					finishPhase();
				}, function(error) {
					// There was an error fetching the script
					console.log(error);
				});
		} else {
			// default load mode
			$scripts
				.each(function() {
					$(this).attr('src', $(this).data('sync-loader'));
				});
		}
	}

	function finishPhase() {
		trigger(phase.number);
		phase.finished = true;
		startPhase(++phase.number);
	}

	function startPhase(phaseNumber) {
		var $toLoaded = $scripts.filter('[data-phase="' + phaseNumber + '"]').not('.sync-loaded');

		$.extend(phase, {
			number: phaseNumber,
			loadedCount: 0,
			toLoadCount: $toLoaded.length,
			started: true,
			finished: false
		});

		if (!phase.toLoadCount) {
			// end execution
			phase.finished = true;
			return;
		}

		loadScripts($toLoaded);

		// $toLoaded
		// 	.each(function() {
		// 		$(this).attr('src', $(this).data('sync-loader'));
		// 	});
	}

	function init() {

		// define vars
		$document = $(document);
		$scripts = $('[data-sync-loader]');

		// login
		bindScriptOnLoad();
		startPhase(1);

	}

	$(document).ready(init);

})(jQuery, window, document);
