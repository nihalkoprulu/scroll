

var NS_ScrollerArr=new Array();

function reAlignScrollers()
{

	var i1;
  for (i1=0;i1<NS_ScrollerArr.length;i1++)
  	NS_ScrollerArr[i1].alignSelf();
}

function Start_NS_Scrollers()
{
	var i1;
  var now=new Date();
  var t=now.getTime();
	for (i1=0;i1<NS_ScrollerArr.length;i1++)
  {
  	NS_ScrollerArr[i1].Load_Scroll();
  	if (NS_ScrollerArr[i1].ScrollEnabled == true)
    {
    	if (NS_ScrollerArr[i1].WaitEach != 0) 
      {
      	NS_ScrollerArr[i1].WaitTo=t+NS_ScrollerArr[i1].WaitEach;        
      }
    	NS_ScrollerArr[i1].MoveId=setTimeout("NS_Scroll_All("+i1+")",NS_ScrollerArr[i1].ScrollInterval);
    }
  }//for i1
}

function NS_Scroll_All(ind)
{
	var ScrollOK=true;
	if (NS_ScrollerArr[ind].WaitEach != 0)
  {
	  var now=new Date();
  	var t=now.getTime();
//    $("#debug").html(ind+": "+t+" "+NS_ScrollerArr[ind].WaitTo);
    if (t < NS_ScrollerArr[ind].WaitTo)
    	ScrollOK=false; 
  }//if (NS_ScrollerArr[ind].MoveEach != 0)
  if (ScrollOK == true)
  {
		NS_ScrollerArr[ind].MoveNews();
  }
 	NS_ScrollerArr[ind].MoveId=setTimeout("NS_Scroll_All("+ind+")",NS_ScrollerArr[ind].ScrollInterval);
}


function CreateScroller(divName,div_speed)
{
	this.divName=divName;
  this.MoveId=0;
  this.ScrollSpeed0=-div_speed;
  this.ScrollInterval=Math.round(Math.abs(1000/this.ScrollSpeed0));
  this.ScrollSpeed=this.ScrollSpeed0;
  this.ScrollSpeedToGo=this.ScrollSpeed0;
  this.ScrollDx=0;
  this.FirstIndex=0;
  this.ScrollEnabled=false;
	this.NewCount=0;
  this.WaitEach=0;
  this.scrollType=0;//vertical, default.
  this.kScroll=1;
  this.mainContainer=null;
  if (this.scrollType == 0)
  {
	  this.h=$("#"+this.divName).height();
  	this.y0=$("#"+this.divName).offset().top;
  }
  else
  {
	  this.h=$("#"+this.divName).width();
  	this.y0=$("#"+this.divName).offset().left;
  }    
  NS_ScrollerArr[NS_ScrollerArr.length]=this;
  

	this.MoveNews = function ()
  {
		var i1;
    var PrevIndex;
  	if (this.ScrollEnabled == true)
    {
	  	if (Math.abs(this.ScrollSpeed-this.ScrollSpeedToGo) > 1)
	    	this.ScrollSpeed+=(this.ScrollSpeedToGo-this.ScrollSpeed)/20
	    else
	    	this.ScrollSpeed=this.ScrollSpeedToGo;
	    this.ScrollDx=this.ScrollSpeed/(1000/this.ScrollInterval);
//      this.h=$("#"+this.divName).height();
//      this.y0=$("#"+this.divName).offset().top;

    	for (i1=0;i1<this.NewCount;i1++)
      {
      	yArr0=this.yArr[i1][0];
      	this.yArr[i1][0]+=this.ScrollDx*this.kScroll;
      }//for i1
      if (this.yArr[this.FirstIndex][0]+this.yArr[this.FirstIndex][1] < 0)
      {
      	if (this.WaitEach != 0)
        {
        	NextIndex=this.FirstIndex+1;
          if (NextIndex >= this.NewCount)
          	NextIndex=0;
          if (this.yArr[NextIndex][0] < 0)
          {
          	dx=0-this.yArr[NextIndex][0];
			    	for (i1=0;i1<this.NewCount;i1++)
			      {
			      	this.yArr[i1][0]+=dx;
			      }//for i1
          }//if (this.yArr[NextIndex][0] < 0)
				  var now=new Date();
				  var t=now.getTime();
	      	this.WaitTo=t+this.WaitEach;        
        }//if (this.WaitEach != 0)
      	PrevIndex=this.FirstIndex-1;
        if (PrevIndex < 0) PrevIndex=this.NewCount-1;
        this.yArr[this.FirstIndex][0]=this.yArr[PrevIndex][0]+this.yArr[PrevIndex][1];
        this.FirstIndex+=1;
        if (this.FirstIndex >= this.NewCount) this.FirstIndex=0;
      } else//if (yArr[FirstIndex][0]+yArr[FirstIndex][1] < 0)
      {
      	if (this.yArr[this.FirstIndex][0] > 0)
        {
  	    	PrevIndex=this.FirstIndex-1;
    	    if (PrevIndex < 0) PrevIndex=this.NewCount-1;
      		this.yArr[PrevIndex][0]=this.yArr[this.FirstIndex][0]-this.yArr[PrevIndex][1];
          this.FirstIndex-=1;
          if (this.FirstIndex < 0) this.FirstIndex=this.NewCount-1;  	
        }//if (yArr[FirstIndex][0] > 0)
      }//if (yArr[FirstIndex][0]+yArr[FirstIndex][1] < 0),else
      for (i1=0;i1<this.NewCount;i1++)
      {
      	if (this.yArr[i1][0] < h)
        {
        	if (this.scrollType == 0)
	  		    $("#"+this.divName+"_"+(i1+1)).css("top",(Math.round(this.yArr[i1][0]))+"px");
          else
          	$("#"+this.divName+"_"+(i1+1)).css("left",(Math.round(this.yArr[i1][0]))+"px");
        }           	
      }//for i1
    }//if (this.ScrollEnabled == true)
  }
  //MoveNews.
  

  this.StopMove = function()
  {
  	this.ScrollEnabled=false;
  }
  
  this.StartMove = function()
  {
  	this.ScrollEnabled=true;
    $("#debug").html("start");
  }
  
  this.alignSelf=function()
  {
	  var dx,dy;
	if (this.mainContainer == null)
	{
		dx=0;dy=0;
	}
	else
	{
		dx=$("#"+this.mainContainer).offset().left;
		dy=$("#"+this.mainContainer).offset().top;
	}
  	$("#"+this.divName).css("left",$("#"+this.divName+"pos").offset().left-dx+"px");
  	$("#"+this.divName).css("top",$("#"+this.divName+"pos").offset().top-dy+"px");
    $("#"+this.divName).width($("#"+this.divName+"pos").width());
    $("#"+this.divName).height($("#"+this.divName+"pos").height());
    $("#"+this.divName).css("clip","rect(0px,"+$("#"+this.divName+"pos").width()+"px,"+$("#"+this.divName+"pos").height()+"px,0px)");
    $("#"+this.divName).css("display","block");
  }
  
  this.Load_Scroll = function(){
  	var _this;
    this.alignSelf();
	  var y=0;
    this.yArr=new Array(this.NewCount);
    this.FirstIndex=0;
    if (this.scrollType == 0)    
	    h=$("#"+divName+"pos").height();
    else
    	h=$("#"+divName+"pos").width();
    totHeight=0;
    maxHeight=0;
    for (i1=1;i1<=this.NewCount;i1++)
    {
    	if (this.scrollType == 0)
	    	hdiv=$("#"+divName+"_"+i1).height();
      else
      	hdiv=$("#"+divName+"_"+i1).width();
    	totHeight+=hdiv;
      if (hdiv > maxHeight) maxHeight=hdiv;
    }    
    if (totHeight < h)
    	this.ScrollEnabled=false;
    else
    {
    	this.ScrollEnabled=true;
      if (totHeight-maxHeight < h)
      {
      
	      s=$("#"+divName).html();
	      for (i1=1;i1<=this.NewCount;i1++)
	      {
        	s+="<div id='"+divName+"_"+(this.NewCount+i1)+"' style='position:absolute;left:0px;top:0px;display:none;'>";
	      	s+=$("#"+divName+"_"+i1).html();
          s+="</div>";
	      }//for i1
	      this.NewCount=this.NewCount*2;
        $("#"+divName).html(s);
      }//if (totHeight-maxHeight < h)
    }//if (totHeight < h),else
    for(i1=1;i1<=this.NewCount;i1++)
    {
    	this.yArr[i1-1]=new Array(2);
      if (this.scrollType == 0)
	      hdiv=$("#"+divName+"_"+i1).height();
      else
      	hdiv=$("#"+divName+"_"+i1).width();
      this.yArr[i1-1][0]=y;
      this.yArr[i1-1][1]=hdiv;
      if (this.scrollType == 0)
      {
		    $("#"+divName+"_"+i1).css("left","0px");
	      if (y > h)
			    $("#"+divName+"_"+i1).css("top",h+"px")
	      else 
			    $("#"+divName+"_"+i1).css("top",y+"px"); 
      }//if (this.scrollType == 0)
      else
      {
		    $("#"+divName+"_"+i1).css("top","0px");
	      if (y > h)
			    $("#"+divName+"_"+i1).css("left",h+"px")
	      else 
			    $("#"+divName+"_"+i1).css("left",y+"px"); 
      }//if (this.scrollType == 0),else
		  $("#"+divName+"_"+i1).css("display","block");
	    y+=hdiv;
   	}//for i1
    
    _this=this;    
    $("#"+divName).mouseover(function(){
    	_this.StopMove();
    });
    
    $("#"+divName).mouseout(function(){
    	_this.StartMove();
    });
    
  	$("#"+divName+"Up").mousedown(function(){
  		_this.ScrollSpeedToGo=-_this.ScrollSpeed0*8;
	  });
    
  	$("#"+divName+"Up").mouseover(function(){
  		_this.ScrollSpeedToGo=-_this.ScrollSpeed0*2;
	  });
    
  	$("#"+divName+"Up").mouseout(function(){
    	_this.ScrollSpeed=0;
  		_this.ScrollSpeedToGo=_this.ScrollSpeed0;
	  });
    
    $("#"+divName+"Up").mouseup(function(){
    	_this.ScrollSpeedToGo=-_this.ScrollSpeed0*2;
    });
  
  	$("#"+divName+"Down").mousedown(function(){
  		_this.ScrollSpeedToGo=_this.ScrollSpeed0*8;
	  });
    
  	$("#"+divName+"Down").mouseover(function(){
  		_this.ScrollSpeedToGo=_this.ScrollSpeed0*2;
	  });
    
  	$("#"+divName+"Down").mouseout(function(){
  		_this.ScrollSpeedToGo=_this.ScrollSpeed0;
	  });
    
    $("#"+divName+"Down").mouseup(function(){
    	_this.ScrollSpeedToGo=_this.ScrollSpeed0*2;
    });
  }//this.Load_Scroll.
	  	        

}
