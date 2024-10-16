package com.campusdual.cd2024bfs5g1.model.core.dao;

import com.ontimize.jee.server.dao.common.ConfigurationFile;
import com.ontimize.jee.server.dao.jdbc.OntimizeJdbcDaoSupport;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Repository;

@Repository(value = "CoworkingDao")
@Lazy
@ConfigurationFile(configurationFile = "dao/CoworkingDao.xml",
        configurationFilePlaceholder = "dao/placeholders.properties")
public class CoworkingDao extends OntimizeJdbcDaoSupport{
    public static final String CW_ID          = "cw_id";
    public static final String CW_NAME        = "cw_name";
    public static final String CW_DESCRIPTION = "cw_description";
    public static final String CW_ADDRESS     = "cw_address";
    public static final String CW_LOCATION    = "cw_location";
    public static final String CW_CAPACITY    = "cw_capacity";
    public static final String CW_DAILY_PRICE = "cw_daily_price";
    public static final String CW_USER_ID     = "cw_usr_id";
    public static final String CW_START_DATE  = "cw_start_date";
    public static final String CW_END_DATE    = "cw_end_date";
}