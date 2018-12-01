/* global it describe run beforeEach before */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';
import { cleanDatabase, prepareDatabase, loginAsAdmin } from './TestHelper';

chai.use(chaiHttp);

const agent = chai.request.agent(app);

before(prepareDatabase);
beforeEach(cleanDatabase);

describe('Users', () => {
  it('should get all users', async (done) => {
    await loginAsAdmin(agent);

    const res = await agent.get('/users');
    expect(res.body).to.have.property('users').to.has.length(3);
    expect(res.body.users[0]).to.have.property('role').to.be.equal('registeredUser');
    expect(res.body.users[1]).to.have.property('role').to.be.equal('admin');
    expect(res.body.users[2]).to.have.property('role').to.be.equal('registeredUser');
    expect(res).to.have.status(200);
    done();
  });

  it('should get one user', async (done) => {
    await loginAsAdmin(agent);

    const res = await agent.get('/users/cjoofresr00001ktst8obwhbs');
    expect(res.body).to.have.property('user');
    expect(res.body.user).to.have.property('cuid').to.be.equal('cjoofresr00001ktst8obwhbs');
    expect(res.body.user).to.have.property('name').to.be.equal('May');
    expect(res.body.user).to.have.property('email').to.be.equal('may@may.com');
    expect(res.body.user).to.have.property('slug').to.be.equal('may');
    expect(res.body.user).to.have.property('role').to.be.equal('admin');
    expect(res.body.user).to.not.have.property('password');
    expect(res).to.have.status(200);
    done();
  });

  it('should create a user', async (done) => {
    await loginAsAdmin(agent);

    const res = await agent.post('/users').send({
      user: {
        name: 'Monica',
        email: 'monica@monica.com',
        password: 'monica',
      },
    });
    expect(res.body).to.have.property('cuid').to.has.length(25);
    expect(res).to.have.status(201);
    done();
  });

  it('should update a user', async (done) => {
    await loginAsAdmin(agent);

    let res = await agent.put('/users/cjoogdu2x0000gctsqv3m95nd').send({
      user: {
        name: 'Monica',
        email: 'monica@monica.com',
        password: 'monica',
      },
    });
    expect(res.body).to.have.property('cuid').to.be.equal('cjoogdu2x0000gctsqv3m95nd');
    expect(res).to.have.status(200);

    res = agent.get('/users/cjoogdu2x0000gctsqv3m95nd');
    expect(res.body).to.have.property('user');
    expect(res.body.user).to.have.property('cuid').to.be.equal('cjoogdu2x0000gctsqv3m95nd');
    expect(res.body.user).to.have.property('name').to.be.equal('Monica');
    expect(res.body.user).to.have.property('email').to.be.equal('monica@monica.com');
    expect(res.body.user).to.have.property('slug').to.be.equal('monica');
    expect(res.body.user).to.have.property('role').to.be.equal('registeredUser');
    expect(res.body.user).to.not.have.property('password');
    expect(res).to.have.status(200);
    done();
  });

  it('should delete a user', async (done) => {
    await loginAsAdmin(agent);

    let res = await agent.delete('/users/cjoogdu2x0000gctsqv3m95nd');
    expect(res.body).to.have.property('cuid').to.be.equal('cjoogdu2x0000gctsqv3m95nd');
    expect(res).to.have.status(200);

    res = await agent.get('/users/cjoogdu2x0000gctsqv3m95nd');
    expect(res).to.have.status(404);
    done();
  });

  it('should not get a user when the request is invalid', async (done) => {
    await loginAsAdmin(agent);

    const res = await agent.get('/users/cjoofresr00001ktst8obws');
    expect(res.body).to.have.property('errors').to.has.length(1);
    expect(res).to.have.status(400);
    done();
  });

  it('should not create a user when the request is invalid', async (done) => {
    await loginAsAdmin(agent);

    const res = await agent.post('/users').send({
      user: {
        name: 'm',
        email: 'monicamonica.com',
        password: 'moa',
      },
    });
    expect(res.body).to.have.property('errors').to.has.length(3);
    expect(res).to.have.status(400);
    done();
  });

  it('should not update a user when the request is invalid', async (done) => {
    await loginAsAdmin(agent);

    let res = await agent.put('/users/cjoofresr00001ktst8obwhbs').send({
      user: {
        name: 'm',
        email: 'monicamonica.com',
        password: 'moa',
      },
    });
    expect(res.body).to.have.property('errors').to.has.length(3);
    expect(res).to.have.status(400);

    res = await agent.get('/users/cjoofresr00001ktst8obwhbs');
    expect(res.body).to.have.property('user');
    expect(res.body.user).to.have.property('cuid').to.be.equal('cjoofresr00001ktst8obwhbs');
    expect(res.body.user).to.have.property('name').to.be.equal('May');
    expect(res.body.user).to.have.property('email').to.be.equal('may@may.com');
    expect(res.body.user).to.have.property('slug').to.be.equal('may');
    expect(res.body.user).to.have.property('role').to.be.equal('admin');
    expect(res.body.user).to.not.have.property('password');
    expect(res).to.have.status(200);
    done();
  });

  it('should get 404 when user does not exist', async (done) => {
    await loginAsAdmin(agent);

    const res = await agent.get('/users/cjoofresr00001ktst8obphbl');
    expect(res).to.have.status(404);
    done();
  });
});

setTimeout(() => run(), 3000);
