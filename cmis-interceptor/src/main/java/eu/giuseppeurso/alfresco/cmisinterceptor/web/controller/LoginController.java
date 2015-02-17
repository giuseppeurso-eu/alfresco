package eu.giuseppeurso.alfresco.cmisinterceptor.web.controller;


import java.text.DateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.ResourceBundle;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import eu.giuseppeurso.alfresco.cmisinterceptor.cmis.SessionCmis;
import eu.giuseppeurso.alfresco.cmisinterceptor.web.form.LoginForm;


/**
 * Handles requests for the application login page.
 * @author Giuseppe Urso - www.giuseppeurso.eu
 */
@Controller
public class LoginController {
	
	private static final Logger logger = LoggerFactory.getLogger(LoginController.class);
	private static String bundle = "configuration";
	private static ResourceBundle settings = ResourceBundle.getBundle(bundle);
	
	/**
	 * Simply selects the login view to render by returning its name.
	 */
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String showLogin(Model model, LoginForm loginForm,Locale locale) {
		logger.info("Login page - the client locale is "+ locale.toString());
		if (!model.containsAttribute("error")) {
			model.addAttribute("error", false);
		}
		model.addAttribute("loginAttribute", loginForm);
		return "login";
	}
	
	/**
	 * The POST method to submit login credentials.
	 * @throws Exception 
	 */
	@RequestMapping(value = "/login", method = RequestMethod.POST)
	public String login(Model model, LoginForm loginForm, Locale locale) throws Exception {
		Date date = new Date();
		DateFormat dateFormat = DateFormat.getDateTimeInstance(DateFormat.LONG, DateFormat.LONG,locale);
		String formattedDate = dateFormat.format(date);
		
		String username = loginForm.getUsername();
		String password = loginForm.getPassword();
		String repourl = settings.getString("alfresco.url")	+ settings.getString("alfresco.cmis.binding");
		logger.info("Login attempt for username '"+ username+"' at: "+formattedDate);
		
		try {
			SessionCmis session = new SessionCmis();
			session.createSession(username, password, repourl);
		} catch (Exception e) {
			logger.info("Failed to created CMIS Session");
			e.printStackTrace();
		}
		
		if (SessionCmis.getCurrentSession()!=null) {
			logger.info("Successfully logged in for username '"+ username+"' at: "+formattedDate);
			return "home";
		}
		else {
			logger.info("Login failed for username '"+ username+"' at: "+formattedDate);
			return "redirect:/login-failed";
		}
	}
	
	/**
	 * The login failed controller
	 * @param model
	 * @return
	 */
	@RequestMapping(value="/login-failed", method = RequestMethod.GET)
	public String loginFailed(Model model, LoginForm loginForm) {
		logger.debug("Showing the login failed page");
		model.addAttribute("error", true);
		model.addAttribute("loginAttribute", loginForm);
		return "login";
	}

	/**
	 * The logout controller
	 * @param model
	 * @return
	 */
	@RequestMapping(value="/logout", method = RequestMethod.GET)
	public String logout(Model model) {
		//TO DO....
		//Session.getCurrentSession().clear();
		return "redirect:/";
	}
	
}
