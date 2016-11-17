/*
Licensed to the Apache Software Foundation (ASF) under one or more
contributor license agreements.  See the NOTICE file distributed with
this work for additional information regarding copyright ownership.
The ASF licenses this file to You under the Apache License, Version 2.0
(the "License"); you may not use this file except in compliance with
the License.  You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
package eu.giuseppeurso.alfresco.utils.archive;

import org.alfresco.repo.node.archive.NodeArchiveService;
import org.alfresco.service.cmr.repository.StoreRef;
import org.apache.log4j.Logger;
import org.springframework.extensions.webscripts.Cache;
import org.springframework.extensions.webscripts.DeclarativeWebScript;
import org.springframework.extensions.webscripts.Status;
import org.springframework.extensions.webscripts.WebScriptRequest;

import java.util.HashMap;
import java.util.Map;

/**
 * Thanks to:
 * http://camelcase.blogspot.it/2011/03/purge-alfresco-archived-nodes.html
 *
 * @author http://camelcase.blogspot.it/2011/03/purge-alfresco-archived-nodes.html
 * 
 */
public class Purge extends DeclarativeWebScript {
	
	final Logger logger = Logger.getLogger(Purge.class);
    private NodeArchiveService nodeArchiveService;
 
    public void setNodeArchiveService(NodeArchiveService nodeArchiveService) {
        this.nodeArchiveService = nodeArchiveService;
    }
 
    @Override
    protected Map<String, Object> executeImpl(WebScriptRequest req, Status status, Cache cache) {
        logger.info("Purging all archived nodes... ");
        final long start = System.currentTimeMillis();
        try {
            this.nodeArchiveService.purgeAllArchivedNodes(StoreRef.STORE_REF_WORKSPACE_SPACESSTORE);
        } catch (Throwable t) {
            logger.error("Error executing purge: ", t);
            errorMessage(status, Status.STATUS_INTERNAL_SERVER_ERROR, "Runtime error: " + t.getMessage() + ". Cause: " + t.getCause());
            return null;
        }
        final long elapsed = System.currentTimeMillis() - start;
        Map<String, Object> model = new HashMap<String, Object>();
        model.put("elapsed", elapsed);
        logger.info("Elapsed time (ms): " + elapsed);
        return model;
    }
 
    private void errorMessage(Status status, int code, final String message) {
        status.setCode(code);
        status.setMessage(message);
        status.setRedirect(true);
    }
}