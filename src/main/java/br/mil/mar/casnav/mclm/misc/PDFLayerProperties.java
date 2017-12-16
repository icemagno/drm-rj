package br.mil.mar.casnav.mclm.misc;

import java.util.ArrayList;
import java.util.List;

public class PDFLayerProperties {
	private List<PDFLayerProperty> properties;
	private String layerName;
	
	public void addProperty( PDFLayerProperty property ) {
		properties.add( property );
	}
	
	public PDFLayerProperties( String layerName ) {
		this.layerName = layerName;
		properties = new ArrayList<PDFLayerProperty>();
	}
	
	public List<PDFLayerProperty> getProperties() {
		return properties;
	}

	public String getLayerName() {
		return layerName;
	}
	
}
