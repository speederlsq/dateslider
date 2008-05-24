/* Date slider element, Ajaxorized.com,  2008 */
var sliderReference;

/* Extend the data element a bit */
Date.prototype.getDiffDays = function(p_oDate) {
	p_iOneDay = 1000*60*60*24;
	return Math.ceil((p_oDate.getTime()-this.getTime())/(p_iOneDay));
}

/* The dateslider */
DateSlider = Class.create({
	initialize : function(p_sBarId, p_sStartDate, p_sEndDate, p_iStartYear, p_iEndYear) {
		/* Start */
		this.barStartDate = Date.parse(p_iStartYear+'-01-01');

		this.iStartYear = p_iStartYear;
		this.iEndYear = p_iEndYear;
		
		/* Panel dates */
		this.oStartDate = Date.parse(p_sStartDate);
		this.oEndDate = Date.parse(p_sEndDate);		

		/* The fields (set later) */
		this.oStartField = null;
		this.oEndFiedl = null;
	
		sliderReference = this;
		
		this.sliderBarMargin = 2;
		
		l_oStartDate = Date.parse(p_sStartDate);
		l_oEndDate = Date.parse(p_sEndDate);
		
		this.dayDivWidth = 2;
		this.iLeftOffsetLH = this.barStartDate.getDiffDays(l_oStartDate)*this.dayDivWidth;
		this.iLeftOffsetRH = this.barStartDate.getDiffDays(l_oEndDate)*this.dayDivWidth;			
		
		this.createSliderBar(p_sBarId);
		this.createHandles(p_sBarId, p_sStartDate, p_sEndDate);
		this.createShiftPanel(p_sBarId, p_sStartDate, p_sEndDate);
	},
	createSliderBar : function(p_sBarId) {
		/* Create the yearlabels */
		var sliderDayDivWidth = this.dayDivWidth;

		l_iYear = this.iStartYear;
		while(l_iYear <= this.iEndYear) {		
			l_oData = Date.parse('01-01-'+l_iYear);
			if(l_oData.isLeapYear()) iDays = 366; else iDays = 365;  
			
			divWidth = sliderDayDivWidth*iDays;
			l_oDiv = $(Builder.node('div', {className : 'slideYear', style : 'width:'+(divWidth-1)+'px'})).update(l_iYear);
			
			iTotalDays = 0;
			(12).times(function(e) {
				monthDivWidth = l_oData.getDaysInMonth()*sliderDayDivWidth;
				l_oMonthDiv = Builder.node('div', {className : 'slideMonth',style : 'width:'+(monthDivWidth)+'px; left:'+iTotalDays+'px'});
				if(e==0) { 
					$(l_oMonthDiv).addClassName('firstMonth');
				} else {
					$(l_oMonthDiv).update(l_oData.toString("MMM"));
				}
				l_oDiv.appendChild(l_oMonthDiv);
				iTotalDays += monthDivWidth;
				l_oData.addMonths(1);
			});
			$(p_sBarId).appendChild(l_oDiv);
			l_iYear++;
		}
		
		/* Set the the right position and length */
		
		l_iCorrection = $(p_sBarId).parentNode.offsetWidth/2;
		l_shiftLeft = 0-(this.barStartDate.getDiffDays(Date.today()))+l_iCorrection;
		l_oFinishDate = Date.parse((this.iEndYear+1)+'-01-01');
		iBarWidth =this.barStartDate.getDiffDays(l_oFinishDate);
	 	$(p_sBarId).setStyle({left : l_shiftLeft*sliderDayDivWidth+'px', width : iBarWidth*sliderDayDivWidth+'px'});	
		new Draggable($(p_sBarId), {snap: this.sliderLimitPos, constraint:'horizontal', starteffect : '', endeffect:'', zindex:'0'});
	},
	
	createHandles : function(p_sBarId, p_sStartDate, p_sEndDate) {
		/* Calculate positions */
		l_oLeftHandle = $(Builder.node('span', {'class': 'leftHandle', id : 'lefthandle', style:'left:'+this.iLeftOffsetLH+'px'})).update('&nbsp;');
		
		l_oRightHandle = $(Builder.node('span', {'class': 'rightHandle', id : 'righthandle', style:'left:'+this.iLeftOffsetRH+'px'})).update('&nbsp;');
		
		
		$(p_sBarId).appendChild(l_oLeftHandle);
		$(p_sBarId).appendChild(l_oRightHandle);

		new Draggable(l_oLeftHandle,  {snap: this.handleLimitPos, containment: p_sBarId, constraint:'horizontal', onDrag :  sliderReference._leftDrag, onEnd : sliderReference._leftDrag});
														

		new Draggable(l_oRightHandle,  {snap: this.handleLimitPos, containment: p_sBarId, constraint:'horizontal', onDrag : sliderReference._rightDrag, onEnd : sliderReference._rightDrag });	
	},
	createShiftPanel : function(p_sBarId, p_sStartDate, p_sEndDate) {
		/* Calculate width */
		l_iBarWidth = (this.iLeftOffsetRH-this.iLeftOffsetLH)+(2*this.sliderBarMargin);

		l_oShiftPanel = $(Builder.node('div', {id : 'shiftpanel', style:'left:'+(this.iLeftOffsetLH)+'px; width:'+l_iBarWidth+'px'}));
		$(p_sBarId).appendChild(l_oShiftPanel);		
		new Draggable(l_oShiftPanel, {snap: this.handleLimitPos, constraint:'horizontal', starteffect : '', endeffect:'', zindex:'0', onDrag : function() { 
															/* Set the handlers while dragging the shiftpanel */
															$('lefthandle').setStyle({left: ($('shiftpanel').offsetLeft-sliderReference.sliderBarMargin)+'px'});
															$('righthandle').setStyle({left: ($('shiftpanel').offsetLeft + $('shiftpanel').offsetWidth-sliderReference.sliderBarMargin)+'px'});						
															sliderReference._setDates();
															}});	
	},
	sliderLimitPos: function(x, y, drag)
		{
		 inbox=drag.element.getDimensions();
		 outbox=Element.getDimensions(drag.element.parentNode);
		 return [x > 0 ? 0 : (x > outbox.width - inbox.width ? x : outbox.width - inbox.width), y];
		},
	
	handleLimitPos: function(x, y, drag) 
		{
		 inbox = drag.element.getDimensions();
		 outbox = Element.getDimensions(drag.element.parentNode);
		 maxPos = drag.element.hasClassName('leftHandle') ?
			parseInt($('righthandle').style.left)-inbox.width : outbox.width - inbox.width;
		 
		 minPos = drag.element.hasClassName('rightHandle') ?
			parseInt($('lefthandle').style.left)+inbox.width : 0;
		 return [ x > maxPos ? maxPos : (x < minPos ? minPos : x), y];
		},
	_setDates : function() {
		/* Get the position of the handles */
		l_iLeftPos = $('lefthandle').offsetLeft/this.dayDivWidth;
		l_iRightPos = $('righthandle').offsetLeft/this.dayDivWidth;
		
		l_oDate = this.barStartDate.clone().addDays(l_iLeftPos);
		l_oDate2 = this.barStartDate.clone().addDays(l_iRightPos);
	
		if(this.oStartField && this.oEndField) {
			this.oStartField.setValue(l_oDate.toString('d MMM yyyy'));		
			this.oEndField.setValue(l_oDate2.toString('d MMM yyyy'));		
		}
		
	},
	_rightDrag : function () {
		l_panelLength = $('righthandle').offsetLeft - $('lefthandle').offsetLeft - 5;
		$('shiftpanel').setStyle({width : (l_panelLength+2*sliderReference.sliderBarMargin)+'px'});																	
		sliderReference._setDates();	
	},
	_leftDrag : function() {
		l_panelLength = $('righthandle').offsetLeft - $('lefthandle').offsetLeft - 4;
		$('shiftpanel').setStyle({left: ($('lefthandle').offsetLeft+4)+'px', width : l_panelLength+'px'});															
		sliderReference._setDates();		
	},
	morphTo : function (p_oDateStart, p_oDateEnd) {
		l_offsetLeftLH = this.barStartDate.getDiffDays(l_oStartDate)*this.dayDivWidth;
		l_offsetLeftRH = this.barStartDate.getDiffDays(p_oDateEnd)*this.dayDivWidth;
		l_panelLength = l_offsetLeftRH - l_offsetLeftLH  - 4;
		$('lefthandle').morph('left:'+l_offsetLeftLH+'px');
		$('righthandle').morph('left:'+l_offsetLeftRH+'px');
		$('shiftpanel').morph('width : '+(l_panelLength+2*sliderReference.sliderBarMargin)+'px; left : '+(l_offsetLeftLH+2)+'px');																			
	},
	attachFields : function (p_oStartField, p_oEndField) {
		this.oStartField = p_oStartField;
		this.oEndField = p_oEndField;
		
		p_oStartField.setValue(this.oStartDate.toString('d MMM yyyy'));
		p_oEndField.setValue(this.oEndDate.toString('d MMM yyyy'));
		
		p_oStartField.observe('blur', function(e) {
			/* Morph to the new date */
			l_oStartDate = Date.parse(p_oStartField.getValue());
			l_oEndDate = Date.parse(p_oEndField.getValue());
			sliderReference.morphTo(l_oStartDate, l_oEndDate);
		});	
		
		p_oEndField.observe('blur', function(e) {
			/* Morph to the new date */
			l_oStartDate = Date.parse(p_oStartField.getValue());
			l_oEndDate = Date.parse(p_oEndField.getValue());
			sliderReference.morphTo(l_oStartDate, l_oEndDate);
		});							
		
	}
});