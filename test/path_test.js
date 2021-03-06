/* eslint-env qunit */
/* globals $, svgedit, equals */
/* eslint-disable no-var */
$(function () {
	// log function
	QUnit.log = function (details) {
		if (window.console && window.console.log) {
			window.console.log(details.result + ' :: ' + details.message);
		}
	};

	test('Test svgedit.path.replacePathSeg', function () {
		expect(6);

		var path = document.createElementNS(svgedit.NS.SVG, 'path');
		path.setAttribute('d', 'M0,0 L10,11 L20,21Z');
		svgedit.path.init();
		svgedit.path.Path(path);

		equals(path.pathSegList.getItem(1).pathSegTypeAsLetter, 'L');
		equals(path.pathSegList.getItem(1).x, 10);
		equals(path.pathSegList.getItem(1).y, 11);

		svgedit.path.replacePathSeg(SVGPathSeg.PATHSEG_LINETO_REL, 1, [30, 31], path);

		equals(path.pathSegList.getItem(1).pathSegTypeAsLetter, 'l');
		equals(path.pathSegList.getItem(1).x, 30);
		equals(path.pathSegList.getItem(1).y, 31);
	});

	test('Test svgedit.path.Segment.setType simple', function () {
		expect(9);

		var path = document.createElementNS(svgedit.NS.SVG, 'path');
		path.setAttribute('d', 'M0,0 L10,11 L20,21Z');
		svgedit.path.init();
		svgedit.path.Path(path);

		equals(path.pathSegList.getItem(1).pathSegTypeAsLetter, 'L');
		equals(path.pathSegList.getItem(1).x, 10);
		equals(path.pathSegList.getItem(1).y, 11);

		var segment = new svgedit.path.Segment(1, path.pathSegList.getItem(1));
		segment.setType(SVGPathSeg.PATHSEG_LINETO_REL, [30, 31]);
		equals(segment.item.pathSegTypeAsLetter, 'l');
		equals(segment.item.x, 30);
		equals(segment.item.y, 31);

		// Also verify that the actual path changed.
		equals(path.pathSegList.getItem(1).pathSegTypeAsLetter, 'l');
		equals(path.pathSegList.getItem(1).x, 30);
		equals(path.pathSegList.getItem(1).y, 31);
	});

	test('Test svgedit.path.Segment.setType with control points', function () {
		expect(14);

		// Setup the dom for a mock control group.
		var svg = document.createElementNS(svgedit.NS.SVG, 'svg');
		var path = document.createElementNS(svgedit.NS.SVG, 'path');
		path.setAttribute('d', 'M0,0 C11,12 13,14 15,16 Z');
		svg.appendChild(path);
		var selectorParentGroup = document.createElementNS(svgedit.NS.SVG, 'g');
		selectorParentGroup.setAttribute('id', 'selectorParentGroup');
		svg.appendChild(selectorParentGroup);
		var mockContext = {
			getDOMDocument: function () { return svg; },
			getDOMContainer: function () { return svg; },
			getSVGRoot: function () { return svg; },
			getCurrentZoom: function () { return 1; }
		};
		svgedit.path.init(mockContext);
		svgedit.utilities.init(mockContext);
		var segment = new svgedit.path.Segment(1, path.pathSegList.getItem(1));
		segment.path = new svgedit.path.Path(path);

		equals(path.pathSegList.getItem(1).pathSegTypeAsLetter, 'C');
		equals(path.pathSegList.getItem(1).x1, 11);
		equals(path.pathSegList.getItem(1).y1, 12);
		equals(path.pathSegList.getItem(1).x2, 13);
		equals(path.pathSegList.getItem(1).y2, 14);
		equals(path.pathSegList.getItem(1).x, 15);
		equals(path.pathSegList.getItem(1).y, 16);

		segment.setType(SVGPathSeg.PATHSEG_CURVETO_CUBIC_REL, [30, 31, 32, 33, 34, 35]);
		equals(path.pathSegList.getItem(1).pathSegTypeAsLetter, 'c');
		equals(path.pathSegList.getItem(1).x1, 32);
		equals(path.pathSegList.getItem(1).y1, 33);
		equals(path.pathSegList.getItem(1).x2, 34);
		equals(path.pathSegList.getItem(1).y2, 35);
		equals(path.pathSegList.getItem(1).x, 30);
		equals(path.pathSegList.getItem(1).y, 31);
	});

	test('Test svgedit.path.Segment.move', function () {
		expect(6);

		var path = document.createElementNS(svgedit.NS.SVG, 'path');
		path.setAttribute('d', 'M0,0 L10,11 L20,21Z');
		svgedit.path.init();
		svgedit.path.Path(path);

		equals(path.pathSegList.getItem(1).pathSegTypeAsLetter, 'L');
		equals(path.pathSegList.getItem(1).x, 10);
		equals(path.pathSegList.getItem(1).y, 11);

		var segment = new svgedit.path.Segment(1, path.pathSegList.getItem(1));
		segment.move(-3, 4);
		equals(path.pathSegList.getItem(1).pathSegTypeAsLetter, 'L');
		equals(path.pathSegList.getItem(1).x, 7);
		equals(path.pathSegList.getItem(1).y, 15);
	});

	test('Test svgedit.path.Segment.moveCtrl', function () {
		expect(14);

		var path = document.createElementNS(svgedit.NS.SVG, 'path');
		path.setAttribute('d', 'M0,0 C11,12 13,14 15,16 Z');
		svgedit.path.init();
		svgedit.path.Path(path);

		equals(path.pathSegList.getItem(1).pathSegTypeAsLetter, 'C');
		equals(path.pathSegList.getItem(1).x1, 11);
		equals(path.pathSegList.getItem(1).y1, 12);
		equals(path.pathSegList.getItem(1).x2, 13);
		equals(path.pathSegList.getItem(1).y2, 14);
		equals(path.pathSegList.getItem(1).x, 15);
		equals(path.pathSegList.getItem(1).y, 16);

		var segment = new svgedit.path.Segment(1, path.pathSegList.getItem(1));
		segment.moveCtrl(1, 100, -200);
		equals(path.pathSegList.getItem(1).pathSegTypeAsLetter, 'C');
		equals(path.pathSegList.getItem(1).x1, 111);
		equals(path.pathSegList.getItem(1).y1, -188);
		equals(path.pathSegList.getItem(1).x2, 13);
		equals(path.pathSegList.getItem(1).y2, 14);
		equals(path.pathSegList.getItem(1).x, 15);
		equals(path.pathSegList.getItem(1).y, 16);
	});
});
