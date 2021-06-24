// public/js/script.js
/*
코드 - front-end js
public/js/script.js파일은 node.js 서버에서 사용하는 코드가 아니고,
client의 브라우저에서 사용하게 될 JavaScript입니다.
그래서 public 폴더에 들어 있으며, head.ejs파일에 이 파일을
불러오는 코드가 작성됩니다.
*/
$(function(){
  function get2digits (num){
    return ('0' + num).slice(-2);
  }

  function getDate(dateObj){
    if(dateObj instanceof Date)
      return dateObj.getFullYear() + '-' + get2digits(dateObj.getMonth()+1)+ '-' + get2digits(dateObj.getDate());
  }

  function getTime(dateObj){
    if(dateObj instanceof Date)
      return get2digits(dateObj.getHours()) + ':' + get2digits(dateObj.getMinutes())+ ':' + get2digits(dateObj.getSeconds());
  }

  function convertDate(){
    $('[data-date]').each(function(index,element){
      var dateString = $(element).data('date');
      if(dateString){
        var date = new Date(dateString);
        $(element).html(getDate(date));
      }
    });
  }
/*
convertDate함수는 html element중에 data-date이 있는 것을 찾습니다.
예를 들:
<span data-date="2020-01-08T20:08:24.586Z"></span>
data-date에 날짜데이터가 들어 있으면, 해당 데이터를 년-월-일의 형태로 변환해서 element의 텍스트 데이터로 넣습니다.
<span data-date="2020-01-08T20:08:24.586Z">2020-01-08</span>
결국 웹페이지상에서 이용자는 '2020-01-08'이라는 글짜만 보게 됩니다.
*/
  function convertDateTime(){
    $('[data-date-time]').each(function(index,element){
      var dateString = $(element).data('date-time');
      if(dateString){
        var date = new Date(dateString);
        $(element).html(getDate(date)+' '+getTime(date));
      }
    });
  }

  convertDate();
  convertDateTime();
});
/*
convertDateTime함수는 data-date-time을 찾아서
년-원-일 시:분:초의 형태로 변환해서 출력합니다.

이렇게 하는 이유는 JavaScript에서 날짜/시간을 원하는 형태(format)으로
만들기 위해서입니다. JavaScript는 일정한 형태로만 날짜/시간을 출력하는데,
'2020-01-01'과 같은 형태로 출력하려면, moment같은 외부 라이브러리를 사용하거나,
저처럼 이렇게 직접 해당 함수를 만들어 주어야 합니다.

이전에 작성된 게시판 만들기 강의에서는 이러한 날짜 변환을 서버에서 했었는데요,
서버가 해외에 있는 경우 시간이 해당 지역의 시간대로 변경되는 문제가 있어서
client에서 변환하는 것으로 변경하였습니다.
*/
