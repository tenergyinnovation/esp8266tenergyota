const path = require( 'path' )
/**
 * Generic background Cloud Function to be triggered by Cloud Storage.
 *
 * @param {object} data The event payload.
 * @param {object} context The event metadata.
 */
exports.insertFirmwaresOnBigquery = ( data, context ) => {
  const file = data;
  
  const filename = path.basename( file.name )
  const ext = path.extname( filename )
  if ( ext !== '.bin' ) {
    console.log( 'Not a firmware file.' )
    return 'ok'
  }
  
  const filenameWithoutExt = path.basename( file.name, ext )
  const dir = path.dirname( file.name )
  const version = dir.split( '/' ).pop()
  const variant = filenameWithoutExt.split( '_' ).pop()
  const row = { 
    id : context.eventId,
    bucket : file.bucket,
    version,
    fullname : file.name,
    filename,
    variant,
    createdAt : file.timeCreated,
    eventType : context.eventType,
  }

  console.log( 'Row to insert', row )
  return insertIntoBigquery( row )
};