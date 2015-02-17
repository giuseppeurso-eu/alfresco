package eu.giuseppeurso.alfresco.cmissession;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.chemistry.opencmis.client.api.Repository;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.api.SessionFactory;
import org.apache.chemistry.opencmis.client.runtime.SessionFactoryImpl;
import org.apache.chemistry.opencmis.commons.SessionParameter;
import org.apache.chemistry.opencmis.commons.enums.BindingType;

/**
 * An example class to create a CMIS session
 * 
 * @author giuseppe
 *
 */
public class CmisSession {

	
/**
 * The create CMIS session method
 */
public void createSession() {	
				
		// The default factory implementation
		SessionFactory sessionFactory = SessionFactoryImpl.newInstance();
		Map<String, String> parameter = new HashMap<String, String>();
		
		// ECM user credentials
		parameter.put(SessionParameter.USER, "admin");
		parameter.put(SessionParameter.PASSWORD, "blablabla");
		
		// ECM connection settings
		parameter.put(SessionParameter.ATOMPUB_URL, "http://myhost:8080/alfresco/cmisatom");
		parameter.put(SessionParameter.BINDING_TYPE, BindingType.ATOMPUB.value());
		
		// Get a list of repositories retrieved by the atompub CMIS endpoint (for Alfresco there is only one element)
		List<Repository> repositories = sessionFactory.getRepositories(parameter);
			
		// Create CMIS session to the repository
		Session session = repositories.get(0).createSession();
		
		// Get some repository info
		System.out.println("Repository Name: "+session.getRepositoryInfo().getName());
		System.out.println("Repository ID: "+session.getRepositoryInfo().getId());
		System.out.println("CMIS Version: "+session.getRepositoryInfo().getCmisVersion());
	}


	/**
	 * A main to test methods
	 * 
	 * @param args
	 */
	public static void main(String[] args) {
		CmisSession cmisSession = new CmisSession();
		cmisSession.createSession();
	}

}
