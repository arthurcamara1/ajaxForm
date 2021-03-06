/* 
	ajaxform 
	by Arthur Camara
*/

(function($) {
	$.fn.extend({
		ajaxform: function(options) { 

			var defaults = {
				ajaxform_class: 'ajaxform',
				button_selector: '[type="submit"]',
				action_field: 'data-action',
				autoerase_field: 'data-autoerase'
			}

			options = $.extend(defaults, options);

			return this.each(function() {

				var form = $(this);
				form.removeClass(options.ajaxform_class); //prevent from doing this twice
				var button = form.find(options.button_selector);
				var action = form.attr(options.action_field);
				var autoerase = (form.attr(options.autoerase_field) == 'true') ? true : false;
				
				var stripTags = function(text, whitelist) {
					$('html').append("<div id='stripTags' stye='display:none'>"+text+"</div>");
					if(typeof whitelist === 'undefined') {
						var whitelist = "b, strong, i, em, br";
					}
					var superwhitelist = "br";
					$("#stripTags *").not(whitelist).each(function() {
					    var content = $(this).contents();
					    $(this).replaceWith(content);
					});
					$("#stripTags *").not(superwhitelist).each(function(){
						var txt = $(this).text();
						if(txt == '') $(this).remove();
					});
					var new_text = $('#stripTags').html();
					$('#stripTags').remove();
					return new_text;
				}

				var sendAjaxForm = function() {

					var pars = {};
					//parse parameters
					form.find('textarea, input[type!="checkbox"]').each(function() {
						var field_name = $(this).attr('name');
						var field_value;
						if($(this).hasClass('dontstrip')) {
							field_value = $(this).val().replace(/\r\n|\r|\n/g,"<br />");
						}
						else {
							field_value = stripTags($(this).val().replace(/\r\n|\r|\n/g,"<br />"));
						}
						pars[field_name] = field_value;
						
					}); 

					form.find('select').each(function() {
						var field_name = $(this).attr('name');
						var field_value = $(this).find('option:selected').val();
						pars[field_name] = field_value;
					});

					form.find('input[type="checkbox"]').each(function() {
						var field_name = $(this).attr('name');
						var field_value = $(this).is(":checked") ? "1" : "0";
						pars[field_name] = field_value;
						
					}); 

					form.find('input[type="radio"]').each(function() {
						var field_name = $(this).attr('name');
						var field_value =  $(this).val();
						if($(this).is(":checked")) {
							pars[field_name] = field_value;
						}
						
					});

					//call function

					var funct;
					try {
						//chech if it exists
						funct = eval(action);
					}
					catch(e) {
						funct = null;
					}
					//if itÅ› a function, then call it
					if($.isFunction(funct)) {
						funct(pars);

						if(autoerase === true) {
							form.find('textarea['+defaults['autoerase_field']+'!="false"], input['+defaults['autoerase_field']+'!="false"]').each(function() {
								$(this).val('');
								$(this).change();
							});
							form.find('select').each(function() {
								$(this).find('option:selected').removeAttr('selected');
								$(this).find('option').first().attr('selected', 'selected');
								$(this).change();
							});
						}
					}
				};

				button.on('click', sendAjaxForm);

			});
		}

	});
})(jQuery);