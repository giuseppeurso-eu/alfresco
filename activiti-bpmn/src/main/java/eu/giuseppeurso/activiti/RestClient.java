package eu.giuseppeurso.activiti;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;

import java.util.Map;

import org.apache.commons.io.FileUtils;
import org.json.JSONArray;
import org.json.JSONObject;


import eu.giuseppeurso.utilities.generics.parser.JsonUtils;
import eu.giuseppeurso.utilities.generics.strings.StringPlayer;
import eu.giuseppeurso.utilities.networking.HttpStuff;


public class RestClient {

	public static void main(String[] args) {
		
		// ACTIVITI CREDENTIALS
		String activitiUrl = "http://localhost:8080/activiti-app";
		String username = "admin@app.activiti.com";
		String password = "admin";
		String endpoint = "";
		String processKey="myProcessKey"; // the unique "key" identifier of the process definition (case sensitive !!!)
		//String processKey="TestAttach";
		String response="";
		String jsonFieldNameQuestionario="questionariojson";
		String jsonFieldNameCommento="commento";
		String jsonFieldNameAllegato="allegatoId";
		
		
		// UPLOAD FILES 
		//-------------------
		System.out.println("\n>>> ATTACH DOCUMENT");
		endpoint=activitiUrl+"/api/enterprise/content/raw";
		System.out.println(">>> ENDPOINT: "+endpoint);
		String pathname="src/main/resources/files/test-file-01.pdf";
		File file = new File(pathname);
		InputStream fileStream;
		String[] attachIds = new String[2];
		try {
			Map<String, String> fieldsMap = new HashMap<String, String>();
			//fieldsMap.put("taskId", "10126"); 
			fieldsMap.put("isRelatedContent", "true"); 
			
			// Upload file 1
			fileStream = FileUtils.openInputStream(file);
			
			String uploadName = "file-sample-"+StringPlayer. getRandomUUID()+".pdf";
			String resp = HttpStuff.postUploadMultipartBasicAuth(endpoint, username, password, fileStream, "application/pdf", uploadName, "file" , fieldsMap);
			JSONObject respJson = JsonUtils.stringObjectToJsonObject(resp);
			int id = respJson.getInt("id");
			attachIds[0] = String.valueOf(id);
			
			// Upload file 2
			fileStream = FileUtils.openInputStream(file);
			uploadName = "file-sample-" + StringPlayer.getRandomUUID() + ".pdf";
			resp = HttpStuff.postUploadMultipartBasicAuth(endpoint, username, password, fileStream, "application/pdf",uploadName, "file", fieldsMap);
			respJson = JsonUtils.stringObjectToJsonObject(resp);
			id = respJson.getInt("id");
			attachIds[1] = String.valueOf(id);
			
		} catch (IOException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		
//		// GET DEPLOYED APP DEFINITION
//		//-------------------------------
//		System.out.println(">>> GET APP DEFINITION");
//		endpoint=activitiUrl+"/api/enterprise/runtime-app-deployments";
//		System.out.println(">>> ENDPOINT: "+endpoint);
//		Map<String, String> parameters = new HashMap<String, String>();
//		parameters.put("nameLike", "%25"+appName+"%25");
//		response = URLStuff.getUrlAuthWithParameters(endpoint, username, password, parameters);
//		JSONObject jsonResp = JsonUtils.stringObjectToJsonObject(response);
//		String appId;
//		if (jsonResp.has("size")) {
//			if ((Integer) jsonResp.get("size")==1) {
//				JSONArray respData  = jsonResp.getJSONArray("data");
//				JSONObject appDefinition = (JSONObject) respData.get(0);
//				appId=appDefinition.get("id").toString();
//				System.out.println("App Definition ID: "+appId);
//			}
//		}
		
		// GET PROCESS DEFINITION
		//-------------------------------
		System.out.println("\n>>> GET PROCESS DEFINITION ");
		endpoint=activitiUrl+"/api/enterprise/process-definitions";
		System.out.println(">>> ENDPOINT: "+endpoint);
		response = HttpStuff.getUrlAuth(endpoint, username, password);
		System.out.println(response);
		JSONObject jsonProcs = JsonUtils.stringObjectToJsonObject(response);
		String procDefId = null;
		if (jsonProcs.has("size")) {
			JSONArray data = jsonProcs.getJSONArray("data");
			for (int i = 0; i < jsonProcs.getInt("size"); i++) {
				JSONObject proc = data.getJSONObject(i);
				System.out.println("Check process definition ID: "+proc.get("id"));
				if (proc.get("id").toString().indexOf(processKey)>=0) {
					procDefId=proc.get("id").toString();
					System.out.println("!!! ID found: "+procDefId);
				}else {
					System.out.println("nope.....");
				}
			}
		}
				
		
		// START PROCESS
		//-------------------
		System.out.println("\n>>> START PROCESS DEFINITION ");
		endpoint=activitiUrl+"/api/enterprise/process-instances";
		System.out.println(">>> ENDPOINT: "+endpoint);
		JSONObject jsonProcDefFilter = new JSONObject();
		jsonProcDefFilter.put("processDefinitionId", procDefId);
		JSONObject startForm = new JSONObject();
		startForm.put(jsonFieldNameAllegato, attachIds[0]+","+attachIds[1]);
		String questionarioData = "{\"id\":\"395834\",\"nome\":\"Paolo\",\"cognome\":\"Negri\"}";
		startForm.put(jsonFieldNameQuestionario, questionarioData);
		startForm.put(jsonFieldNameCommento, "Dati inviati via REST su Start Process");
		jsonProcDefFilter.put("values", startForm);
		System.out.println("Json input: "+jsonProcDefFilter.toString());
		String responseProc = HttpStuff.postJsonBasicAuth(endpoint, username, password, jsonProcDefFilter);
		JSONObject jsonProcStarted = new JSONObject(responseProc);
		String procStartedId = jsonProcStarted.getString("id").toString();
		System.out.println("Process started with ID: "+procStartedId);
		
//		// GET TASK
//		//-------------------
//		System.out.println("\n>>> GET TASK");
//		endpoint=activitiUrl+"/api/enterprise/tasks/query";
//		System.out.println(">>> ENDPOINT: "+endpoint);
//		JSONObject jsonTaskFilter = new JSONObject();
//		jsonTaskFilter.put("processInstanceId", procStartedId);
//		String responseTask = URLStuff.postJsonAuth(endpoint, username, password, jsonTaskFilter);
//		JSONObject jsonTask = new JSONObject(responseTask);
//		String taskId = jsonTask.getJSONArray("data").getJSONObject(0).getString("id");
//		System.out.println("Task found with ID: "+taskId);
//		
//		// GET FORM
//		//-------------------
//		System.out.println("\n>>> GET FORM");
//		endpoint=activitiUrl+"/api/enterprise/task-forms";
//		endpoint = endpoint+"/"+taskId;
//		String respForm = URLStuff.getUrlAuth(endpoint, username, password);
//		JSONObject jsonFormResp = JsonUtils.stringObjectToJsonObject(respForm);
//		String formId = String.valueOf(jsonFormResp.getInt("id"));
//		System.out.println("Form found with ID: "+formId);
//				
//		// PUT JSON
//		//-------------------
//		System.out.println("\n>>> PUT JSON");
//		endpoint = activitiUrl+"/api/enterprise/task-forms";
//		endpoint = endpoint+"/"+taskId+"/save-form";
//		System.out.println(">>> ENDPOINT: "+endpoint);
//		String webappJson = "{\"id\":\"395834\",\"nome\":\"Paolo\",\"cognome\":\"Negri\"}";
//		JSONObject jsonFormQuestionario = new JSONObject();
//		jsonFormQuestionario.put(jsonFieldNameQuestionario, webappJson);
//		jsonFormQuestionario.put(jsonFieldNameCommento, "Dati JSON inseriti da chiamata REST");
//		JSONObject jsonPostValues = new JSONObject();
//		jsonPostValues.put("values", jsonFormQuestionario);
//		String saveFormResp = URLStuff.postJsonAuth(endpoint, username, password, jsonPostValues); 
//		
//		// ATTACH 
//		//-------------------
//		System.out.println("\n>>> ATTACH UPLOADED DOC");
//		endpoint = activitiUrl+"/api/enterprise/task-forms";
//		endpoint = endpoint+"/"+taskId+"/save-form";
//		System.out.println(">>> ENDPOINT: "+endpoint);
//		String attachId1 = "6017";
//		jsonFormQuestionario = new JSONObject();
//		jsonFormQuestionario.put(jsonFieldNameAllegato, attachId1);
//		jsonFormQuestionario.put(jsonFieldNameCommento, "File Allegati inseriti da chiamata REST");
//		jsonPostValues = new JSONObject();
//		jsonPostValues.put("values", jsonFormQuestionario);
//		saveFormResp = URLStuff.postJsonAuth(endpoint, username, password, jsonPostValues); 		
						
//		// ATTACH DOC
//		//-------------------
//		System.out.println("\n>>> ATTACH DOCUMENT");
//		//endpoint=activitiUrl+"/api/enterprise/tasks";
//		//endpoint=endpoint+"/"+taskId+"/raw-content";
//		endpoint=activitiUrl+"/api/enterprise/process-instances";
//		endpoint=endpoint+"/"+procStartedId+"/raw-content";
//		System.out.println(">>> ENDPOINT: "+endpoint);
//		String pathname="src/main/resources/files/test-file-01.pdf";
//		File file = new File(pathname);
//		InputStream fileStream;
//		try {
//			fileStream = FileUtils.openInputStream(file);
//			Map<String, String> fieldsMap = new HashMap<String, String>();
//			//fieldsMap.put("taskId", "10126"); 
//			fieldsMap.put("isRelatedContent", "true"); 
//			URLStuff.postMultipartAuth(endpoint, username, password, fileStream, "application/pdf", "my-file2.pdf", "file" , fieldsMap);
//		} catch (IOException e) {
//			e.printStackTrace();
//		} catch (Exception e) {
//			e.printStackTrace();
//		}

	}

}
