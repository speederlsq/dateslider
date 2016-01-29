_All the documentation you need to integrate the dateslider on your page_

# Classes #

### DateSlider(`string` element\_reference, `string` span\_start, `string` span\_end, `int` year\_start, `int` year\_end [, `object` options] ) ###

_Parameters:_
|  **Parameter** | **Description** |
|:---------------|:----------------|
| element\_reference | id our element of the reference div (container of the slider) |
| span\_start    | initial start of the selected span (e.g. '2008-Feb-01') |
| span\_end      | initial start of the selected span (e.g. '2008-May-01') |
| year\_start    | First year that comes available in the slider (e.g. 2001) |
| year\_end      | Last year that comes available in the slider (e.g. 2008) |
| options        | Optional object containing options (see reference below) |

_Options:_

The options object contains a number of options that allow you to dynamically change the behavior of the dateslider:

|  **Option** | **Description** | **Default** |
|:------------|:----------------|:------------|
|  dayWidth   | Width of 1 day in px. Can be used to zoom the date span | 1           |
|  dragHandles | Determines if the handles to drag are available | true        |
|  dragBar    | Determines if the bars to drag are available | true        |
|  dateFormat | Date format that is returned when using function attchFields. See  the [DateJs Format specifiers](http://code.google.com/p/datejs/wiki/FormatSpecifiers) to customize the date format | d MMM yyyy  |
| zoom        | Determines if the zooming functionality is available  | false       |
| centerDate  | Centered date when initializing the dateslider  | current date |
| onEnd       | Callback function which is triggered when dropping the bar or the handles | -           |
| onStart     | Callback function which is triggered when the users start to drag the bar or the handlers | -           |

_Return value_

Instance of DateSlider.

_Examples:_
```
/* Create a dateslider, starting at may 01, ending at may 31, available years: 2007 - 2008 */
p_oDateSlider = new DateSlider('sliderbar', '2008-May-01', '2008-May-31', 2007, 2008);

/* Create a dateslider with some options */
l_oOptions = {
	dragHandles:false,
	onEnd : function() { alert('Stopped dragging!!') },
	onStart : function() { alert('Started dragging!!') },
	dayWidth: 2,
	dateFormat : 'MMMM d, yyyy',
	zoom : true    
}

p_oDateSlider = new DateSlider('sliderbar', '2008-Jan-01', '2008-May-31', 2007, 2009, l_oOptions);	
```