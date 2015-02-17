package eu.giuseppeurso.alfresco.cmisinterceptor.cmis;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;


/**
 * The Session CMIS interceptor class. The CMIS Session validity check takes place here.
 * This class implements the spring HandlerInteceptor
 * to processing requests into three steps:<br>
 * - pre-handle<br>
 * - post-handle<br>
 * - after-completition<br>
 * @see org.springframework.web.servlet.HandlerInterceptor
 * @author Giuseppe Urso - www.giuseppeurso.eu
 * 
 */
public class SessionCmisInterceptor implements HandlerInterceptor {

	private static final Logger log = LoggerFactory.getLogger(SessionCmisInterceptor.class);
	
	@Override
	public boolean preHandle(HttpServletRequest request,HttpServletResponse response, Object handler) throws Exception {

		log.debug("Pre-handle");
		String username = request.getParameter("username");
		String password = request.getParameter("password");

				
		 // Intercepting the requests when a CmisSession is valid.
		if (SessionCmis.getCurrentSession() != null) {
			log.debug("CMIS Session already created.");
			if (request.getRequestURI().equals("/sampleaci/")) {
				log.debug("Redirect to the home page.");
				response.sendRedirect(response.encodeRedirectURL(request.getContextPath() + "/home"));
			}
		} 
		//Intercepting the requests except the login and login-failed, when a CimisSession is not valid.
		else {
			log.info("CMIS session not exists...");
			if( (!request.getRequestURI().equals("/sampleaci/")) && 
				(!request.getRequestURI().equals("/sampleaci/login-failed")) &&
				(username==null && password==null) ){
				response.sendRedirect(response.encodeRedirectURL(request.getContextPath()));
			}
		}
		return true;
	}

	@Override
	public void postHandle(HttpServletRequest request,
			HttpServletResponse response, Object handler,
			ModelAndView modelAndView) throws Exception {
		log.debug("Post-handle");
	}

	@Override
	public void afterCompletion(HttpServletRequest request,
			HttpServletResponse response, Object handler, Exception ex)
			throws Exception {
		log.debug("After-completion");
	}

}
