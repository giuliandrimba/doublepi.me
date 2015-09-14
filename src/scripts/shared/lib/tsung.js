;
(function()
{
  var parseStyle = function(style)
  {
    var regexp = /((?:[a-z0-9]*-)*[a-z0-9]*): ((?:-)?[a-z0-9]*)/g
    var st = style.cssText || style.style.cssText;
    st = st.toLowerCase()
    var result = st.match(regexp);

    var obj = {};

    for(var i = 0; i < result.length; i++)
    {
      var newRegexp = /((?:[a-z0-9]*-)*[a-z0-9]*): ((?:-)?[a-z0-9]*)/
      var newResult = result[i].match(newRegexp);
      obj[newResult[1].toString()] = newResult[2].toString();
    }

    return obj;
  }

  var searchClassInStylesheets = function(className)
  {
    var stylesheets = document.styleSheets;

    for(var i = 0; i < stylesheets.length; i++)
    {
      if(searchClass(className, stylesheets[i]))
      {
        return searchClass(className, stylesheets[i]);
      }
    }
  }

  var searchClass = function(className, stylesheet)
  {
    var rules = stylesheet.cssRules || stylesheet.rules;

    for(var i = 0; i < rules.length; i++)
    {
      var item = rules[i] || rules.item(i);

      if(item.selectorText && item.selectorText.toLowerCase() === className.toLowerCase())
      {
        return parseStyle(item);
      }
    }

    return false;
  }

  window.tsung = function(className)
  {
    return searchClassInStylesheets(className);
  }

})()
