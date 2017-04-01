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

	function checkPhaseStatus() {	
		return (++phase.loadedCount) === phase.toLoadCount;
	}

	function bindScriptOnLoad() {
		$scripts.on('load', function() {
			$(this).addClass('sync-loaded');
			if(checkPhaseStatus()) {
				finishPhase();
			};
		});
	}

	function triggerEvent(number) {
		dispatchEvent('syncloader.phase.' + number);
	}
	
	function dispatchEvent(name) {
		$document.trigger(name);
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
		triggerEvent(phase.number);
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

	}

	function init() {

		// define vars
		$document = $(document);
		$scripts = $('[data-sync-loader]');

		// logic
		bindScriptOnLoad();
		startPhase(1);

	}

	$(document).ready(init);

})(jQuery, window, document);
