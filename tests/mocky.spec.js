const Chai = require('chai');
const Mocky = require('./index');
const { assert } = require('chai');
const ChaiAsPromised = require('chai-as-promised');
const Supertest = require('supertest-as-promised');

Chai.use(ChaiAsPromised);
const { expect, assert } = Chai;

describe('Mocky Test', () => {
    let mocky;
    before(() => {
        mocky = new Mocky({
            url: 'http://localhost:3200',
            endpoints: [{
                path: '/users',
                method: 'GET',
                reply: [
                    { id: 1, email: 'john@yopmail.com'},
                    { id: 2, email: 'steve@yopmail.com'}
                ]
            }]
        }, {
            url: 'http://localhost:3200',
            endpoints: [{
                path: '/users/{id}',
                method: 'GET',
                reply: function() {
					if(id == 1) {
						return { id: 1, email: 'john@yopmail.com'};
					} else if (id == 2) {
						return { id: 2, email: 'steve@yopmail.com'};
					}
				}
            }]
		});
		mocky.mock();
	});
	
	after(() => {
		mocky.done();
	});

	it('GET All test', async () => {
		const res = await request
			.get('users')
			.expect(200);
		expect(res.body).to.deep.equal([
			{ id: 1, email: 'john@yopmail.com'},
			{ id: 2, email: 'steve@yopmail.com'}
		]);
	});

	it('GET one item', async () => {
		const res = await request
			.get('users/2')
			.expect(200);
		expect(res.body).to.deep.equal({ id: 2, email: 'steve@yopmail.com'});
	});
});