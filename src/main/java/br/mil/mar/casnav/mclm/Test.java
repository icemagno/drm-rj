package br.mil.mar.casnav.mclm;

import java.io.File;

import com.drew.imaging.ImageMetadataReader;
import com.drew.lang.Rational;
import com.drew.metadata.Metadata;
import com.drew.metadata.exif.GpsDirectory;



public class Test {

	public static void scanDir( String diretorioOrigem ) throws Exception {
        File sourceFolder = new File( diretorioOrigem );
        
        File[] files = sourceFolder.listFiles();
        if (files != null) {
            for (File file : files) {      
                String fileName = file.getName();
                if ( fileName.endsWith(".jpg") ) {
                    processa( file );
                }
            }
        }		
		
	}

	
	public static void processa( File file ) throws Exception {
		
		Metadata metadata = ImageMetadataReader.readMetadata( file );
		GpsDirectory gpsDirectory = metadata.getFirstDirectoryOfType( GpsDirectory.class );
		if (gpsDirectory instanceof GpsDirectory) {
			final GpsDirectory gps = (GpsDirectory) gpsDirectory;
			final Rational[] lat = gps.getRationalArray( GpsDirectory.TAG_LATITUDE );
			    final double latitude = lat[0].doubleValue() + lat[1].doubleValue()  / 60 + lat[2].doubleValue() / 3600;
			    final Rational[] lng = gps.getRationalArray( GpsDirectory.TAG_LONGITUDE );
			    final double longitude = lng[0].doubleValue() + lng[1].doubleValue() / 60 + lng[2].doubleValue() / 3600;

			    System.out.println("Arquivo : " + file.getName() );
			    System.out.println(latitude);
			    System.out.println(longitude);			
		}
		
	}
	
	public static void main(String[] args) throws Exception {
		scanDir("d:/");

	}
	

}
