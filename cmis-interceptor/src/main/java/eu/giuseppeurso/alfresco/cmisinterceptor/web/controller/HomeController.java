package eu.giuseppeurso.alfresco.cmisinterceptor.web.controller;

import java.util.Locale;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import eu.giuseppeurso.alfresco.cmisinterceptor.cmis.SessionCmis;

/**
 * Handles requests for the application home page.
 * @author Giuseppe Urso - www.giuseppeurso.eu
 */
@Controller
public class HomeController {
	
	private static final Logger logger = LoggerFactory.getLogger(HomeController.class);
	
	/**
	 * Simply selects the home view to render by returning its name.
	 */
	@RequestMapping(value = "/home", method = RequestMethod.GET)
	public String home(Locale locale, Model model) {
		
		logger.info("Welcome page, the client locale is "+ locale.toString());
		if (SessionCmis.getCurrentSession() == null){
			logger.info("CMIS session is not valid. The Spring Interceptor will redirect to the login page...");
		}
		return "home";
	}
	
}
