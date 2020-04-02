const { BigQuery } = require( '@google-cloud/bigquery' )
const semver = require( 'semver' )

const projectId = process.env.GCLOUD_PROJECT
const bqClient = new BigQuery( { projectId } )

/**
 * Responds to any HTTP request.
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.getDownloadUrl = async ( req, res ) => {
  try {
    const { version, variant } = req.query
    console.log( 'Fetch version and variant ', version, variant )    
    
    const queryParams = {
      query : `
        SELECT 
          bucket,
          fullname,
          version,
          createdAt
        FROM \`esp8266tenergyota.ota.firmwares\`
        where variant = @variant
        order by createdAt desc
        limit 1      
      `,
      params : {
        variant
      }
    }

    const [ rows ] = await bqClient.dataset( BQ_DATASET ).table( BQ_TABLE ).query( queryParams )
    if ( rows.length > 0 ) {
      const firmware = rows[0]
      
      // latest > current
      const needsUpdate = semver.gt( firmware.version, version )      
      if ( needsUpdate ) {
        const url = await getPublicUrl( firmware.fullname )
        console.log( 'Sending url', url )
        res.status( 200 ).send( url );
      } else {
        res.status( 204 ).send( 'Up to date' );  
      }

    } else {
      res.status( 204 ).send( 'No new version' );
    }

  } catch ( err ) {
    res.status( 500 ).send( err.message );
  }
}