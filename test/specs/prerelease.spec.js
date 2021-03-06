'use strict';

const cli = require('../fixtures/cli');
const files = require('../fixtures/files');
const check = require('../fixtures/check');
const chai = require('chai');

chai.should();

describe('bump --prerelease', () => {
  it('should not increment a non-existent version number', () => {
    files.create('package.json', {});
    files.create('bower.json', { name: 'my-app' });

    let output = cli.exec('--prerelease');

    output.stderr.should.be.empty;
    output.stdout.should.be.empty;
    output.status.should.equal(0);

    files.json('package.json').should.deep.equal({});
    files.json('bower.json').should.deep.equal({ name: 'my-app' });
  });

  it('should treat empty version numbers as 0.0.0', () => {
    files.create('package.json', { version: '' });
    files.create('bower.json', { version: null });
    files.create('component.json', { version: 0 });

    let output = cli.exec('--prerelease');

    output.stderr.should.be.empty;
    output.status.should.equal(0);

    output.lines.should.deep.equal([
      `${check} Updated package.json to 0.0.1-beta.0`,
      `${check} Updated bower.json to 0.0.1-beta.0`,
      `${check} Updated component.json to 0.0.1-beta.0`,
    ]);

    files.json('package.json').should.deep.equal({ version: '0.0.1-beta.0' });
    files.json('bower.json').should.deep.equal({ version: '0.0.1-beta.0' });
    files.json('component.json').should.deep.equal({ version: '0.0.1-beta.0' });
  });

  it('should increment an all-zero version number', () => {
    files.create('package.json', { version: '0.0.0' });

    let output = cli.exec('--prerelease');

    output.stderr.should.be.empty;
    output.status.should.equal(0);

    output.lines.should.deep.equal([
      `${check} Updated package.json to 0.0.1-beta.0`,
    ]);

    files.json('package.json').should.deep.equal({ version: '0.0.1-beta.0' });
  });

  it('should reset the minor and patch', () => {
    files.create('package.json', { version: '1.2.3' });

    let output = cli.exec('--prerelease');

    output.stderr.should.be.empty;
    output.status.should.equal(0);

    output.lines.should.deep.equal([
      `${check} Updated package.json to 1.2.4-beta.0`,
    ]);

    files.json('package.json').should.deep.equal({ version: '1.2.4-beta.0' });
  });

  it('should reset the prerelease version', () => {
    files.create('package.json', { version: '1.2.3-beta.4' });

    let output = cli.exec('--prerelease');

    output.stderr.should.be.empty;
    output.status.should.equal(0);

    output.lines.should.deep.equal([
      `${check} Updated package.json to 1.2.3-beta.5`,
    ]);

    files.json('package.json').should.deep.equal({ version: '1.2.3-beta.5' });
  });

  it('should honor the --preid flag', () => {
    files.create('package.json', { version: '1.2.3-beta.4' });

    let output = cli.exec('--prerelease --preid alpha');

    output.stderr.should.be.empty;
    output.status.should.equal(0);

    output.lines.should.deep.equal([
      `${check} Updated package.json to 1.2.3-alpha.0`,
    ]);

    files.json('package.json').should.deep.equal({ version: '1.2.3-alpha.0' });
  });
});
