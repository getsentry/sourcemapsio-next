function SourceMapNotFoundError(url) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = `Unable to locate a SourceMap in ${url}`;
  this.resolutions = [
    'Add a <code>//# sourceMappingURL=</code> declaration',
    'Add a SourceMap HTTP response header'
  ];
}

function UnableToFetchError(url) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = `Unable to fetch ${url}`;
}

function UnableToFetchMinifiedError(url) {
  UnableToFetchError.call(this);
  this.resolutions = [
    'Is your url correct?'
  ];
}

function UnableToFetchSourceMapError(url) {
  UnableToFetchError.call(this);
  this.resolutions = [
    'SourceMap declaration found, but could not load the file.'
  ];
}

function InvalidSourceMapFormatError(url) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = `Invalid SourceMap format ${url}`;
  this.resolutions = [
    'Everything is broken. Is this really a Source Map?'
  ];
}

module.exports = {
    SourceMapNotFoundError: SourceMapNotFoundError,
    UnableToFetchError: UnableToFetchError,
    UnableToFetchMinifiedError: UnableToFetchMinifiedError,
    UnableToFetchSourceMapError: UnableToFetchSourceMapError,
    InvalidSourceMapFormatError: InvalidSourceMapFormatError
}