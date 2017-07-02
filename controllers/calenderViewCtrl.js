angular.module("myApp")
	.controller("calenderViewCtrl", function ($scope, $location, $route) {
	$scope.data = {};
	var date = new Date();
	var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var monthNamesShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	var dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	var suportedViews = ["day", "week", "month"];
	$scope.data.currentView = suportedViews[2];
	$scope.data.calenderDate = new Date();
	$scope.data.currWeekDates = [];
	$scope.data.database = {};
	
	var currYear = $scope.data.calenderDate.getFullYear();
	var currMonth = $scope.data.calenderDate.getMonth();
	var currDate = $scope.data.calenderDate.getDate();
	var currDay = $scope.data.calenderDate.getDay();	
	var currMonthName = monthNames[currMonth];
	var currDayName = dayNames[currDay];
	
	function CalenderEvent () {
		this.title = "";
		this.startDate = new Date();
		this.duration = 0;
	}	
	
	$scope.data.monthNameAndYear = currMonthName + " " + currYear;
	$scope.data.monthViewHeaderTitle = currDayName + " " + currDate;
	
	
    $scope.showModal = false;
	$scope.data.formInputs = {};
	$scope.data.formInputs.eventName = "";
    $scope.inUseEventData = {'startHour':$scope.data.calenderDate, 'duration' : 30};
    $scope.toggleModal = function(data){
		$scope.inUseEventData = data;
		var startHour = data.startHour;
		var newDate = new Date(startHour);
		var year = newDate.getFullYear();
		var month = newDate.getMonth();
		var date = newDate.getDate();
		var hour = newDate.getHours();
		var halfHour = (newDate.getMinutes() == 0) ? 0 : 1;		
		var eventData = $scope.data.database[year.toString()][month][date][hour][halfHour];
		if(eventData.title != undefined)
		{
			$scope.data.formInputs.eventName = eventData.title;
		}
		else{
			$scope.data.formInputs.eventName = "";
		}
        $scope.showModal = !$scope.showModal;
    };	
	
	$scope.nHourMinToTimeString = function(hour, currMinutes){
		var h = hour % 12 || 12;
		var ampm = hour < 12 ? "am" : "pm";
		timeString = h + ":" + ((currMinutes > 0) ? currMinutes : "00") + ampm;	
		return timeString;
	}
	
	$scope.dateToReadableDate = function(date){
		var currYear = date.getFullYear();
		var currMonth = date.getMonth();
		var currDate = date.getDate();
		var currDay = date.getDay();	
		var currHours = date.getHours();	
		var currMinutes = date.getMinutes();	
		var currMonthName = monthNames[currMonth];
		var currDayName = dayNamesShort[currDay];		
		var duration = 30;
		var endHourMinFactor = ((duration + currMinutes) == 60)  ? 1 : 0;
		var endHours = currHours + endHourMinFactor;
		var endMin = (currMinutes == 0)  ? 30 : 0;
		var startHourStr = $scope.nHourMinToTimeString(currHours, currMinutes);
		var endHourStr = $scope.nHourMinToTimeString(endHours, endMin);

		return currDayName + ", " + currMonthName + " " + currDate + ", " + startHourStr + " - " + endHourStr;
	}
	
	$scope.initDatabase = function(){
		for(i = 2001; i < 2050; i++)
		{
			var monthArray = new Array();
			for(j = 0; j < 12 ; j++)
			{	
				var jMonthArray = new Array();
				for(k = 0; k < 32; k++)
				{
					var kDayArray = new Array();
					for(l = 0; l < 24; l++)
					{
						var lHourArray = new Array();
						for(m = 0; m < 2; m++)
						{							
							lHourArray[m] = {};
						}
						
						kDayArray[l] = lHourArray;
					}
					
					jMonthArray[k] = kDayArray;
				}
				
				monthArray[j] = jMonthArray;
			}
			
			$scope.data.database[i.toString()] = monthArray;
		}
	}	
	
	$scope.initDatabase();
	
	$scope.getWeakStartDate = function(date){
		var currDate = date.getDate();
		var currDay = date.getDay();		
		var first = currDate - currDay;
		var startDate = new Date(date.setDate(first));
		return startDate;	
	}
	
	$scope.getNthDateFromDate = function(date, nth){
		var newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + nth);
		return newDate;
	}
	
	$scope.updateCurrWeekDates = function(date){
		var currYear = date.getFullYear();
		var currMonth = date.getMonth();
		var currDate = date.getDate();
		var firstDay = new Date(currYear, currMonth, currDate);
		var startDate = $scope.getWeakStartDate(firstDay);		
		$scope.data.currWeekDates = [];
		for (i = 0; i < 7; i++) { 
			$scope.data.currWeekDates[i] = $scope.getNthDateFromDate(startDate, i);
		}
	}		
	
	$scope.updateCurrWeekDatesTofirtsWeek = function(date){
		var currYear = date.getFullYear();
		var currMonth = date.getMonth();
		var firstDay = new Date(currYear, currMonth, 1);
		var startDate = $scope.getWeakStartDate(firstDay);		
		$scope.data.currWeekDates = [];
		for (i = 0; i < 7; i++) { 
			$scope.data.currWeekDates[i] = $scope.getNthDateFromDate(startDate, i);
		}
	}	
	
	$scope.updateCurrWeekDates($scope.data.calenderDate);	
	
	$scope.getDaysInMonth = function(month,year){
		return new Date(year, month, 0).getDate();
	}	
	
	$scope.getDayNameOfDate = function(month,year,date){
		return dayName[new Date(year, month, date).getDay()];
	}	
	
	$scope.updateMonthNameAndYear = function(){
		currYear = $scope.data.calenderDate.getFullYear();
		currMonth = $scope.data.calenderDate.getMonth();
		var currMonthName = monthNames[currMonth];
		$scope.data.monthNameAndYear = currMonthName + " " + currYear;		
	}
	
	$scope.updateMonthViewHeaderTitle = function(){
		var currDate = $scope.data.calenderDate.getDate();
		var currDay = $scope.data.calenderDate.getDay();	
		var currDayName = dayNames[currDay];
		$scope.data.monthViewHeaderTitle = currDayName + " " + currDate;
	}	
	
	$scope.isWeekChanged = function(){
		var isChanged = true; 
		for(var i = 0 ; i < 7 ; i++){
			if($scope.data.currWeekDates[i] == $scope.data.calenderDate){
				isChanged = false;
				break;
			}
		}	

		return isChanged;
	}
	
	$scope.updateDateByDay = function(direction){
		var currDate = $scope.data.calenderDate.getDate();
		if(direction > 0)
		{
			$scope.data.calenderDate = new Date($scope.data.calenderDate.setDate(currDate + 1));
		}
		else
		{
			$scope.data.calenderDate = new Date($scope.data.calenderDate.setDate(currDate - 1));
		}
		
		$scope.updateMonthViewHeaderTitle();
		$scope.updateMonthNameAndYear();
		if($scope.isWeekChanged){
			$scope.updateCurrWeekDates($scope.data.calenderDate);	
		}
	}
	
	$scope.updateDateByWeak = function(direction){
		var currDate = $scope.data.calenderDate.getDate();
		var currDay = $scope.data.calenderDate.getDay();		
		var first = currDate - currDay;			
		if(direction > 0)
		{	
			$scope.data.calenderDate = new Date($scope.data.calenderDate.setDate(first + 7));			
		}
		else
		{
			$scope.data.calenderDate = new Date($scope.data.calenderDate.setDate(first - 7));
		}		
		
		$scope.updateCurrWeekDates($scope.data.calenderDate);	
		$scope.updateMonthNameAndYear();
		$scope.updateMonthViewHeaderTitle();
	}	
	
	$scope.updateDateByMonth = function(direction){
		var currYear = $scope.data.calenderDate.getFullYear();
		var currMonth = $scope.data.calenderDate.getMonth();
		if(direction > 0)
		{
			$scope.data.calenderDate = new Date(currYear, currMonth + 1, 1);
		}
		else
		{
			$scope.data.calenderDate = new Date(currYear, currMonth - 1, 1);
		}		
		
		$scope.updateMonthNameAndYear();
		$scope.updateMonthViewHeaderTitle();
		$scope.updateCurrWeekDatesTofirtsWeek($scope.data.calenderDate);	
	}	
		
	$scope.changeView = function(viewType){
		$scope.data.currentView = suportedViews[viewType];
		if($scope.data.currentView == suportedViews[0]){
			$location.path("/dayView");
		}
		else if($scope.data.currentView == suportedViews[1]){
			$location.path("/weekView");
		}
		else if($scope.data.currentView == suportedViews[2]){
			$location.path("/monthView");
		}
	}
	
	$scope.changeToCurrentDateView = function()
	{
		$scope.data.calenderDate = new Date();
		$scope.changeView(0);
	}
	
	$scope.nextPage = function () {
		var direction = 1;
		if($scope.data.currentView == "month")
		{
			$scope.updateDateByMonth(direction);
		}
		else if($scope.data.currentView == "day"){
			$scope.updateDateByDay(direction);
		}
		else if($scope.data.currentView == "week"){
			$scope.updateDateByWeak(direction);
		}
	}
	
	$scope.prevPage = function () {
		var direction = -1;
		if($scope.data.currentView == "month"){
			$scope.updateDateByMonth(direction);
		}
		else if($scope.data.currentView == "day"){
			$scope.updateDateByDay(direction);
		}
		else if($scope.data.currentView == "week"){
			$scope.updateDateByWeak(direction);
		}		
	}

	
	
	$scope.getDayViewData = function(inDate)
	{
		var x = 60; 
		var times = []; 
		var tt = 0;
		var json = [];
		
		for (var i=0; tt < 24 * 60; i++) {
			data = {};		
			var hh = Math.floor(tt/60); 
			var mm = (tt%60); 
			var timeLevel = ("0" + (hh % 12)).slice(-2) + ':00';
			data.timeLevel = timeLevel;
			data.timeDivisions = new Array();
			for (j = 0; j < 2; j++) {
				var timeDivision ={};
				var currYear = inDate.getFullYear();
				var currMonth = inDate.getMonth();
				var currDate = inDate.getDate();		
				var date = new Date(currYear, currMonth, currDate);
				var time = date.getTime();
				timeDivision.startHour = new Date(time + (hh * 60 + (j * 30)) * 60 * 1000);
				//var calenderEvent = $scope.data.database[currYear.toString()][currMonth][currDate - 1][hh][j];
				//timeDivision.calenderEvent = calenderEvent;
				timeDivision.duration = 30;
				data.timeDivisions[j] = timeDivision;
				
			}			
			
			tt = tt + x;
			json[i] = data;
		}			
		
		return json;
	}
	
	
	$scope.getWeekViewData = function(){
		var json = [];
		for(i = 0; i < 7; i++)
		{
			json[i] = $scope.getDayViewData($scope.data.currWeekDates[i]);
		}
		return json;
	}
	
	$scope.getTopEvents = function(date)
	{
		var topEvents = new Array();
		var currYear = date.getFullYear();
		var currMonth = date.getMonth();
		var currDate = date.getDate();	
		var k = 0;
		var allEvents = $scope.data.database[currYear.toString()][currMonth][currDate];
		for(i = 0; i < 24; i++){
			for(j = 0; j < 2; j++){
				if(allEvents[i][j].hasOwnProperty("title"))
				{
					topEvents[k++] = allEvents[i][j];
				}
				if(topEvents.length == 3)
				{
					break;
				}
			}
			if(topEvents.length == 3)
			{
				break;
			}
		}
		return topEvents;
	}	
	
	$scope.getMonthViewData = function(){
		var json = [];
		var currYear = $scope.data.calenderDate.getFullYear();
		var currMonth = $scope.data.calenderDate.getMonth();
		var firstDay = new Date(currYear, currMonth, 1);
		var startDate = $scope.getWeakStartDate(firstDay);
		var k = 0;
		for(i = 0; i < 6; i++){
			var weekData = [];
			for(j = 0; j < 7; j++){
				var newDate = $scope.getNthDateFromDate(startDate, k++);				
				weekData[j] = newDate// $scope.getDayViewData(newDate);
			}
			
			json[i] = weekData;
		}
		
		return json;
	}	
	
	$scope.reoccurringDaily = function(calenderEvent)
	{
		var today = calenderEvent.startDate;
		var year = today.getFullYear();
		var month = today.getMonth();
		var date = today.getDate();			
		var hour = today.getHours();
		var halfHour = (today.getMinutes() == 0) ? 0 : 1;
		for(i = 0; i < 365; i++)
		{		
			var tomorrow = new Date(year, month, date +  1);
			year = tomorrow.getFullYear();
			month = tomorrow.getMonth();
			date = tomorrow.getDate();					
			var newCalenderEvent = {};
			newCalenderEvent.title = calenderEvent.title;
			newCalenderEvent.startDate = new Date(tomorrow.getTime() + (hour * 60 * 60 * 1000) + (halfHour * (30 * 60 * 1000)));
			newCalenderEvent.recStartDate = calenderEvent.recStartDate;
			newCalenderEvent.duration = calenderEvent.duration;					
			$scope.data.database[year.toString()][month][date][hour][halfHour] = calenderEvent;			
		}
	}
	
	$scope.reoccurringWeekly = function(calenderEvent)
	{
		var today = calenderEvent.startDate;
		var year = today.getFullYear();
		var month = today.getMonth();
		var date = today.getDate();			
		var hour = today.getHours();
		var halfHour = (today.getMinutes() == 0) ? 0 : 1;
		for(i = 0; i < 52; i++)
		{		
			var tomorrow = new Date(year, month, date +  7);
			year = tomorrow.getFullYear();
			month = tomorrow.getMonth();
			date = tomorrow.getDate();					
			var newCalenderEvent = {};
			newCalenderEvent.title = calenderEvent.title;
			newCalenderEvent.startDate = new Date(tomorrow.getTime() + (hour * 60 * 60 * 1000) + (halfHour * (30 * 60 * 1000)));
			newCalenderEvent.duration = calenderEvent.duration;					
			$scope.data.database[year.toString()][month][date][hour][halfHour] = calenderEvent;			
		}
	}	
	
	$scope.reoccurringMonthly = function(calenderEvent)
	{
		var today = calenderEvent.startDate;
		var year = today.getFullYear();
		var month = today.getMonth();
		var date = today.getDate();			
		var hour = today.getHours();
		var halfHour = (today.getMinutes() == 0) ? 0 : 1;
		for(i = 0; i < 12; i++)
		{			
			var tomorrow = new Date(year, month + 1, date);
			year = tomorrow.getFullYear();
			month = tomorrow.getMonth();
			date = tomorrow.getDate();		
			var newCalenderEvent = {};
			newCalenderEvent.title = calenderEvent.title;
			newCalenderEvent.startDate = new Date(tomorrow.getTime() + (hour * 60 * 60 * 1000) + (halfHour * (30 * 60 * 1000)));
			newCalenderEvent.duration = calenderEvent.duration;					
			$scope.data.database[year.toString()][month][date][hour][halfHour] = calenderEvent;			
		}
	}	
	
	$scope.updateStatus = function(inUseEventData, $event)
	{
		$event.preventDefault();
		var startHour = inUseEventData.startHour;
		var newDate = new Date(startHour);
		var year = newDate.getFullYear();
		var month = newDate.getMonth();
		var date = newDate.getDate();
		var hour = newDate.getHours();
		var halfHour = (newDate.getMinutes() == 0) ? 0 : 1;
		//alert(year  + " " + month + " " + date + " " + hour + " " + halfHour);
		calenderEvent = {};
		calenderEvent.title = $scope.data.formInputs.eventName;
		calenderEvent.startDate = newDate;
		calenderEvent.recStartDate = newDate;
		calenderEvent.duration = inUseEventData.duration;		
		
		//alert(year  + " " + month + " " + date + " " + hour + " " + halfHour);
		//hasOwnProperty('key')
		$scope.data.database[year.toString()][month][date][hour][halfHour] = calenderEvent;	
		if($scope.data.formInputs.repeat != undefined)
		{
			if($scope.data.formInputs.repeat == "daily")
			{
				$scope.reoccurringDaily(calenderEvent);
			}
			else if($scope.data.formInputs.repeat == "weekly")
			{
				$scope.reoccurringWeekly(calenderEvent);
			}
			else if($scope.data.formInputs.repeat == "monthly")
			{
				$scope.reoccurringMonthly(calenderEvent);
			}
		}
		$('#myModal').modal('hide');
	}	
	
	$scope.ngalert = function(daly)
	{

	}
	
}).directive('modal', function () {
	return {
	  template: '<div id="myModal" class="modal fade">' + 
		  '<div class="modal-dialog">' + 
			'<div class="modal-content">' + 
			  '<div class="modal-header">' + 
				'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' + 
				'<h4 class="modal-title">Create/Edit Event</h4>' + 
			  '</div>' + 
			  '<div class="modal-body" ng-transclude></div>' + 
			'</div>' + 
		  '</div>' + 
		'</div>',
	  restrict: 'E',
	  transclude: true,
	  replace:true,
	  scope:true,
	  link: function postLink(scope, element, attrs) {
		scope.$watch(attrs.visible, function(value){
		  if(value == true)
			$(element).modal('show');
		  else
			$(element).modal('hide');
		});

		$(element).on('shown.bs.modal', function(){
		  scope.$apply(function(){
			scope.$parent[attrs.visible] = true;
		  });
		});

		$(element).on('hidden.bs.modal', function(){
		  scope.$apply(function(){
			scope.$parent[attrs.visible] = false;
			$('body').removeClass('modal-open');
		  });
		});
	  }
	};
});