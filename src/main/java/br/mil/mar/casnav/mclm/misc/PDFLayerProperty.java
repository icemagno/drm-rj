package br.mil.mar.casnav.mclm.misc;

public class PDFLayerProperty {
	private String key;
	private String value;

	public PDFLayerProperty( String key, String value ) {
		this.key = key;
		this.value = value;
	}
	
	public String getKey() {
		return key;
	}
	
	public String getValue() {
		return value;
	}
	
}
