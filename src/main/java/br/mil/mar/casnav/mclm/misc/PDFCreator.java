package br.mil.mar.casnav.mclm.misc;

import java.io.File;
import java.io.FileOutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.UUID;

import org.json.JSONArray;
import org.json.JSONObject;

import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Chunk;
import com.itextpdf.text.Document;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.Font.FontFamily;
import com.itextpdf.text.Image;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;

import br.mil.mar.casnav.mclm.persistence.entity.NodeData;
import br.mil.mar.casnav.mclm.persistence.entity.Scenery;
import br.mil.mar.casnav.mclm.persistence.entity.SceneryNode;
import br.mil.mar.casnav.mclm.persistence.services.SceneryService;


public class PDFCreator {
	private List<PDFLayerProperties> pdfLayerProperties;

	private Paragraph getParagraph( float left, String text, Font footerFont ) {
        Paragraph pp = new Paragraph( text, footerFont );
        pp.setIndentationLeft( left );
        return pp;
	}
	
	
	public String gerarPDF( String path, int idCenario, User user, String bbox ) throws Exception {
		//WebClient wc = new WebClient();
		
		
		pdfLayerProperties = new ArrayList<PDFLayerProperties>();
		
		String outputFolder = PathFinder.getInstance().getPath() + "/tempmaps/" + path;
		String pdfName = UUID.randomUUID().toString().toUpperCase().substring(0,8) + ".pdf";
		String pdfFullPath = outputFolder + File.separator + pdfName;
		
		Document document = new Document( PageSize.A4 );
		PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream( pdfFullPath ) );
		document.open();
		document.addCreator("APOLO");
		document.addAuthor("Carlos Magno O. Abreu");
		document.addTitle("CASNAV");
		document.addCreationDate();
		
		writer.setPageEvent( new HeaderAndFooter() );

		String brasaoDefesaPath = PathFinder.getInstance().getPath() + "/img/defesa.png";
		Image brasaoDefesa = Image.getInstance( brasaoDefesaPath );
		brasaoDefesa.scaleAbsolute(60,60);	
		brasaoDefesa.setAbsolutePosition( 35, PageSize.A4.getHeight() - brasaoDefesa.getScaledHeight() - 15);
		document.add(brasaoDefesa);

		Font footerFont = new Font(FontFamily.COURIER, 8, 0, BaseColor.BLACK );
		
		
		List<Image> thumbs = new ArrayList<Image>();
		document.add( new Paragraph("\n\n\n\n") );
		if ( idCenario > -1 ) {
			SceneryService ss = new SceneryService();
			Scenery scenery = ss.getScenery( idCenario );
			
			String sceneryName = scenery.getSceneryName();
			String sceneryDescription = scenery.getDescription();
			
	        SimpleDateFormat sdfDate = new SimpleDateFormat("dd/MM/yyyy");
	        SimpleDateFormat sdfTime = new SimpleDateFormat("HH:mm:ss");
	        Date sceneryDate = scenery.getCreationDate();
	        String strDate = sdfDate.format(sceneryDate);
	        String strTime = sdfTime.format(sceneryDate);			
			String author = scenery.getUserName();
			String sceneryCenter = scenery.getMapCenterHDMS();
			
			String baseMap = scenery.getBaseMap();
			
			document.add( getParagraph(0, "Cenário      : " + sceneryName , footerFont) );
			document.add( getParagraph(0, "Descrição    : " + sceneryDescription , footerFont) );
			document.add( getParagraph(0, "Centro       : " + sceneryCenter , footerFont) );
			document.add( getParagraph(0, "Criado em    : " + strDate + " " + strTime , footerFont) );
			document.add( getParagraph(0, "Criado por   : " + author , footerFont) );
			document.add( getParagraph(0, "Impresso por : " + user.getName() , footerFont) );
			document.add( new Paragraph("\n") );
			document.add( getParagraph(0, "Camadas: " , footerFont) );
			
			for ( SceneryNode node : scenery.getNodes() ) {
				NodeData theLayer = node.getLayer();
				String layerAlias = theLayer.getLayerAlias();

				// Pega os atributos de camadas WMS
				// Decidi não pegar porque teria que trazer todos os atributos de todos os elementos WMS 
				// da camada no mapa e isso poderia consumir muito tempo, dando timeout no browser.
				/*
				if ( theLayer.getLayerType() == LayerType.WMS  ) {
					String layerUrl = theLayer.getServer().getUrl();
					String layerName = theLayer.getLayerName();
					
					String url= layerUrl + "?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&QUERY_LAYERS=" + layerName + "&layers=" + layerName +
							"&buffer=100&INFO_FORMAT=application/json&FEATURE_COUNT=500&X=65&Y=20&BBOX=" + bbox + "&WIDTH=256&HEIGHT=256";
					
					String features = wc.doGet( url );
					pdfLayerProperties.add( getLayerProperties(features, layerAlias ) );
				}
				*/	
				
				
				
				// Pega os atributos de Feições
				if ( theLayer.getLayerType() == LayerType.FEI  ) {
					String metadados = theLayer.getFeicao().getMetadados();
					pdfLayerProperties.add( getLayerProperties( metadados, layerAlias ) );
				}
				
				String thumbPath = outputFolder + "/" + node.getLayer().getSerialId() + ".png";
				String error = "";
				try {
					Image thumb = Image.getInstance( thumbPath );
					thumbs.add( thumb );
				} catch ( Exception e ) {
					error = " ( Sem miniatura )";
				}
				document.add( getParagraph(0, "    " + node.getLayerAlias() + error , footerFont) );
			}
			
			String thumbPathFei = outputFolder + "/feicoes.png";
			String thumbPathMain = outputFolder + "/mclm_landlayer_cmoa.png";
			if ( new File(thumbPathFei).exists() ) {
				Image thumbFei = Image.getInstance( thumbPathFei );
				document.add( getParagraph(0, "    Camada de Feições", footerFont) );
				thumbs.add( thumbFei );
			}
			
			if ( new File(thumbPathMain).exists() ) {
				Image thumbMain = Image.getInstance( thumbPathMain );
				document.add( getParagraph(0, "    " + baseMap + " ( Camada de fundo )", footerFont) );
				thumbs.add( thumbMain );
			}
			
		} else {
			document.add( getParagraph(0, "Nenhum cenário definido." , footerFont) );
		}
		
		document.add( new Paragraph("\n\n") );
		
		String imageFileName = outputFolder + "/result.png";
		Image image = Image.getInstance( imageFileName );
		float scaler = ((document.getPageSize().getWidth() - document.leftMargin() - document.rightMargin() ) / image.getWidth()) * 100;
		image.scalePercent(scaler);			
		image.setAlignment(Image.MIDDLE);
		image.setBorder( Image.BOX );
		image.setBorderWidth(1);
		document.add(image);
		
		document.add( new Paragraph("\n\n\n\n") );
		

		float thumbScaler;
		float offsetX = 10;
		float offsetY = 60;
		int y = 0;
		int x = 0;
		int h = 0;
		Paragraph p = new Paragraph();
		for ( Image thumb : thumbs ) {
			thumbScaler = ((document.getPageSize().getWidth() - document.leftMargin() - document.rightMargin() ) / image.getWidth()) * 20;
			thumb.scalePercent(thumbScaler);
			thumb.setBorder( Image.BOX );
			thumb.setBorderWidth(1);
			p.add( new Chunk(thumb, (offsetX * x) + 35, offsetY * y) );
			x++;
			h++;
			if ( h == 4 ) {
				h = 0;
				x = 0;
				y--;
			}
		}
		document.add( p );
		

		if ( pdfLayerProperties.size() > 0 ) {
			Font boldNormalFont = new Font(FontFamily.HELVETICA, 9, Font.BOLD, BaseColor.BLACK );
			
			for ( PDFLayerProperties layerProperties : pdfLayerProperties ) {
				document.newPage();
				document.add(brasaoDefesa);
				
				Paragraph layerNameParagraph = new Paragraph( "Atributos da Camada \"" + layerProperties.getLayerName() + "\"", boldNormalFont ); 
				layerNameParagraph.setAlignment( Element.ALIGN_CENTER );
				
				document.add( new Paragraph("\n") );
				document.add( layerNameParagraph );
				document.add( new Paragraph("\n\n") );		

				PdfPTable table = new PdfPTable(2);
				for ( PDFLayerProperty property :  layerProperties.getProperties() ) {
					PdfPCell cellKey = new PdfPCell(new Phrase( property.getKey() , footerFont));
					PdfPCell valueKey = new PdfPCell(new Phrase( property.getValue() , footerFont));
					
					table.addCell( cellKey );
					table.addCell( valueKey );
				}
				
				document.add(table);
			}
			
			
		}
		
		
		document.close();
		writer.close();
		return pdfFullPath;
	}
	
	private PDFLayerProperties getLayerProperties( String metadados, String layerAlias ) {
		// Um metadado é uma FeatureCollection ( Um objeto com um array de Features )
		JSONObject fc = new JSONObject( metadados );
		JSONArray features = fc.getJSONArray("features");
		// So tem uma feature por feicao.
		JSONObject feature = features.getJSONObject(0);
		// Por fim, pega as propriedades da feature
		JSONObject properties = feature.getJSONObject("properties");

		PDFLayerProperties layerProperties = new PDFLayerProperties( layerAlias ); 
		for( Iterator<String> key=properties.keys(); key.hasNext(); ) {
			String theKey = key.next();

			// Caso especial para atributos de feições criadas a partir de camadas WMS
			if ( theKey.equals("attributes") ) {
				JSONArray attrs = properties.getJSONArray( theKey );

				for( int x=0; x< attrs.length(); x++ ) {
					JSONObject attr = attrs.getJSONObject(x);
					
					String originalName = attr.getString("originalName");
					String translatedName = attr.getString("translatedName");
					Object value = attr.get("value");
					
					String theName = originalName;
					if ( !translatedName.equals("" ) ) {
						theName = translatedName;
					}
					
					PDFLayerProperty pdflp = new PDFLayerProperty( theName, String.valueOf( value ) );
					layerProperties.addProperty( pdflp );
				} 
				
			} else {
				Object value = properties.get( theKey );
				PDFLayerProperty pdflp = new PDFLayerProperty( theKey, String.valueOf( value ) );
				layerProperties.addProperty( pdflp );
			}
		}
		
		return layerProperties;
		
	}

}
