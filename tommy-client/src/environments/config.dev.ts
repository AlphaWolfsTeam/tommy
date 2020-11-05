const getCategoriesExptionsOfTable = (tableName: string, networkId: string) =>
    `/api/caisd-rest/${tableName}?WC=network%3D${networkId}&start=1&size=1000`;

export const config = {
    GET_NETWORKS_URL: "/api/caisd-rest/nr?WC=class%3D1000792%20and%20delete_flag%3D0&start=1&size=1000&SORT=z_requests_network_count DESC",
    GET_SERVICES_URL_FUNCTION: (id: string) => `/api/caisd-rest/z_networks_to_service?WC=network%3D${id}%20and%20delete_flag%3D0%20and%20z_service_family%3D1000106&start=1&size=1000&SORT=z_requests_service_count DESC`,
    GET_OPEN_TASKS_URL_FUNCTION: (UUID: string) => `/api/caisd-rest/in?WC=customer%3D${UUID}%20and%20type%3D'I'%20and%20active%3D1&SORT=open_date DESC`,
    GET_OPEN_REQUESTS_TASKS_URL_FUNCTION: (UUID: string) => `/api/caisd-rest/chg?WC=requestor%3D${UUID}%20and%20active%3D1&SORT=open_date DESC`,
    GET_CLOSED_TASKS_URL_FUNCTION: (UUID: string) => `/api/caisd-rest/in?WC=customer%3D${UUID}%20and%20type%3D'I'%20and%20active%3D0&SORT=open_date DESC`,
    GET_CLOSED_REQUESTS_TASKS_URL_FUNCTION: (UUID: string) => `/api/caisd-rest/chg?WC=requestor%3D${UUID}%20and%20active%3D0&SORT=open_date DESC`,
    GET_CATEGORIES_OF_INCIDENTS_URL_FUNCTION: (id: string) => `/api/caisd-rest/pcat?WC=z_impact_service%3D${id}%20and%20delete_flag%3D0&start=1&size=1000`,
    GET_CATEGORIES_OF_REQUESTS_URL_FUNCTION: (id: string) => `/api/caisd-rest/chgcat?WC=z_impact_service%3D${id}%20and%20delete_flag%3D0&start=1&size=1000`,
    GET_UUID_URL_FUNCTION: (userT: string) => `/api/caisd-rest/cnt?WC=userid%3D'${userT}'`,
    GET_TRANSVERSE_URL_FUNCTION: (categoryId: string) => `/api/caisd-rest/in?WC=category%3D'pcat:${categoryId}'%20and%20active%3D1%20and%20impact%3D1`,
    GET_CATEGORIES_EXCEPTIONS_OF_INCIDENTS: (networkId: string) => getCategoriesExptionsOfTable('z_pcat_to_network', networkId),
    GET_CATEGORIES_EXCEPTIONS_OF_REQUESTS: (networkId: string) => getCategoriesExptionsOfTable('z_chgcat_to_network', networkId),
    GET_UPDATES: "/api/caisd-rest/in?WC=type%3D'I'%20and%20active%3D1%20and%20impact%3D1&SORT=open_date DESC",
    POST_NEW_INCIDENT: "/api/caisd-rest/in",
    POST_NEW_REQUEST: "/api/caisd-rest/chg",
    POST_NEW_REQUEST_WITH_FILE: "/api/caisd-rest/chg?repositoryId=1002&serverName=",
    POST_NEW_INCIDENT_WITH_FILE: "/api/caisd-rest/in?repositoryId=1002&serverName=",
    GET_HICHAT_IFRAME_URL: '/hichat',
    POST_SEND_HICHAT_MSG: '/hichat/sendmsg',
    UPDATE_TASK_URL_FUNCTION: (taskType: 'in' | 'chg', taskId: string) => `/api/caisd-rest/${taskType}/${taskId}`,
    GET_UPDATE_TASK_STATUS_BODY: (taskType: "in" | "chg", taskStatus: "CNCL" | "CL" | "REOPEN" | "NSCC") => {
        const taskBody: { [key: string]: any } = {};
        taskBody[taskType] = {
            "status": {
                "@REL_ATTR": taskStatus
            }
        }
        console.log(taskBody);
        
        return taskBody;
    },
    GET_CATEGORY_KNOWLEDGE_ARTICLE: (categoryId: string) => `/api/caisd-rest/pcat?WC=id%3D${categoryId}`,

};
