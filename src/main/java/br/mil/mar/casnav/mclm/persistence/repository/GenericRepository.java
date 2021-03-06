package br.mil.mar.casnav.mclm.persistence.repository;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.management.relation.Relation;

import org.hibernate.Session;
import org.hibernate.Transaction;

import br.mil.mar.casnav.mclm.persistence.exceptions.DatabaseConnectException;
import br.mil.mar.casnav.mclm.persistence.infra.ConnFactory;
import br.mil.mar.casnav.mclm.persistence.infra.DaoFactory;
import br.mil.mar.casnav.mclm.persistence.infra.IDao;

public class GenericRepository  {
	protected Session session;
	private Transaction tx = null;
	private boolean external;
	private Connection connection = null;
	private String connectionString;
	private String user;
	private String password;
	
	public GenericRepository() throws DatabaseConnectException {
		try {
			session = ConnFactory.getSession();
			if ( session != null ) {
				tx = session.beginTransaction();
			} else {
				throw new DatabaseConnectException( "Cannot open Database Session" );
			}
		} catch (Exception e ) {
			e.printStackTrace();
			throw new DatabaseConnectException( e.getMessage() );
		}
		this.external = false;
	}

	private void reopen() throws DatabaseConnectException {
		try {
			this.connection = DriverManager.getConnection(connectionString, user, password);
		} catch (SQLException e) {
			e.printStackTrace();
			throw new DatabaseConnectException( "Cannot open External Database Connection" );
		}	
	}
	
	public GenericRepository( String connectionString, String user, String password ) throws DatabaseConnectException {
		this.connectionString = connectionString;
		this.user = user;
		this.password = password;
		try {
			this.connection = DriverManager.getConnection(connectionString, user, password);
		} catch (SQLException e) {
			e.printStackTrace();
			throw new DatabaseConnectException( "Cannot open External Database Connection" );
		}	
		this.external = true;
	}
	
	private List<?> internalGenericFetchList( String query ) throws Exception {
		System.out.println("internalGenericFetchList " + query );
		
		DaoFactory<Relation> df = new DaoFactory<Relation>();
		IDao<Relation> fm = df.getDao(this.session, Relation.class);
		List<?> retorno = null;
		try {
			retorno = fm.genericAccess( query );
		} catch (Exception e) {
			rollBack();
			closeSession();
			throw e;
		}
		closeSession();
		return retorno;
	}
	
	
	public List<String> getColumnNames( String query ) throws Exception {
		List<String> result = new ArrayList<String>();
		
		Statement stmt = this.connection.createStatement();
		ResultSet objs = stmt.executeQuery( query );
		ResultSetMetaData rsmd = objs.getMetaData();
		int count = rsmd.getColumnCount();
		for (int i = 1; i <= count; i++) {
			String columnName = rsmd.getColumnName( i );
			result.add( columnName );
		}
		this.connection.close();
		return result;
	}
	
	private List<?> externalGenericFetchList( String query ) throws Exception {
		System.out.println("externalGenericFetchList " + query );
		
		List< Map<String,Object> > retorno = new ArrayList< Map<String,Object> >();
		Statement stmt = this.connection.createStatement();
		ResultSet objs = stmt.executeQuery( query );
		
		ResultSetMetaData rsmd = objs.getMetaData();
		int count = rsmd.getColumnCount();
		
		while ( objs.next() ) {
			Map<String,Object> obj = new HashMap<String,Object>();
			for (int i = 1; i <= count; i++) {
				String columnName = rsmd.getColumnName( i );
				String columnData = objs.getString( columnName );
				obj.put(columnName, columnData);
			}
			retorno.add( obj );
		}
		
		this.connection.close();		
		
		return retorno;
	}

	public List<?> genericFetchList( String query ) throws Exception {
		if ( this.external ) {
			return externalGenericFetchList( query );
		} else {
			return internalGenericFetchList( query );
		}
	}
	
	
	public void newTransaction() {
		
		try {
			if( external ) {
				reopen();
				return;
			}
		} catch ( Exception e ) {
			//
		}
		
		if ( !session.isOpen() ) {
			session = ConnFactory.getSession();
			if ( session != null ) {
				tx = session.beginTransaction();
			} else {
				//
			}
		} else {
			//
		}
		
	}
	
	public boolean isOpen() {
		if( external ) {
			try {
				return ( !this.connection.isClosed() );
			} catch ( Exception e ) {
				return false;
			}
		} else return session.isOpen();
	}
	
	public void closeSession() {
		if ( external ) {
			try { this.connection.close(); } catch ( Exception e ) { }
		} else {
			if( isOpen() ) {
				session.close();
			} else {
				//
			}
		}
	}
	
	public void commit() {
		if ( external ) { 
			try { this.connection.commit(); } catch ( Exception e ) {}
		} else tx.commit(); 
	}
	
	public void rollBack() {
		if ( external ) { 
			try { this.connection.rollback(); } catch ( Exception e ) {}
		} else tx.rollback();
	}
	
	
}
