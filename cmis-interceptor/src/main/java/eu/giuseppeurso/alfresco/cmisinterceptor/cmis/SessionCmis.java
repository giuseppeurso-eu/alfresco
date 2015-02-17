package eu.giuseppeurso.alfresco.cmisinterceptor.cmis;



import java.util.HashMap;
import java.util.Map;


import org.apache.chemistry.opencmis.client.api.Repository;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.api.SessionFactory;
import org.apache.chemistry.opencmis.client.runtime.SessionFactoryImpl;
import org.apache.chemistry.opencmis.commons.SessionParameter;
import org.apache.chemistry.opencmis.commons.enums.BindingType;
import org.apache.chemistry.opencmis.commons.exceptions.CmisConnectionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * This class creates a CMIS Session and saves it in a local thread.
 * @author Giuseppe Urso - www.giuseppeurso.eu
 *
 */

@Service
public class SessionCmis {
	
	private static final Logger log = LoggerFactory.getLogger(SessionCmis.class);
	private String user;
	private String password;
	private String repourl;
	
	private static ThreadLocal currentSession = new ThreadLocal() {
        protected synchronized Object initialValue() {
            return null;
        }
    };
	
	public void createSession(String username, String passwd, String url) throws Exception {
		
		Session session = null;
		
		SessionFactory sessionFactory = SessionFactoryImpl.newInstance();
		Map<String, String> parameter = new HashMap<String, String>();
		
		// User credentials.
		parameter.put(SessionParameter.USER, username);
		parameter.put(SessionParameter.PASSWORD, passwd);
		
		// Connection settings.
		parameter.put(SessionParameter.ATOMPUB_URL, url);
		parameter.put(SessionParameter.BINDING_TYPE, BindingType.ATOMPUB.value());
		
		// Create session.
		try {
			Repository ecmRepository = sessionFactory.getRepositories(parameter).get(0);
			
			session = ecmRepository.createSession();
			session.getDefaultContext().setCacheEnabled(true);
			log.info("Connected to the ECM Repository.");
			log.info("Repository Vendor	: "+ecmRepository.getVendorName());
			log.info("Repository Id : "+ecmRepository.getId());
			log.info("Repository RootFolderId : "+ecmRepository.getRootFolderId());
		} catch (CmisConnectionException e) {
			throw new Exception(e);
		}
		
		// save session in local thread
		currentSession.set(session);	
		
	}
	
	
	public void createSession() throws Exception {
		createSession(user, password, repourl);
	}
	
	public void createSession(String username, String passwd) throws Exception {
		createSession(username, passwd, repourl);
	}
	
	public void removeSession() {
		currentSession.remove();
	}
	
	
	public boolean existSession() {
		return getCurrentSession() == null ? false : true;
	}
	
	/**
	 * Get a cmis session from ThreadLocal
	 * @return cmis session
	 */
	public static Session getCurrentSession(){
		// get session from thread local
		return (Session) currentSession.get();
	}

	/**
	 * @param user the user to set
	 */
	public void setUser(String user) {
		this.user = user;
	}
	
	/**
	 * @param password the password to set
	 */
	public void setPassword(String password) {
		this.password = password;
	}

	/**
	 * @param repourl the repourl to set
	 */
	public void setRepourl(String repourl) {
		this.repourl = repourl;
	}
	
}
