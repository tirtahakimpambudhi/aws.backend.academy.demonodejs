import { expect } from 'chai';
import sinon from 'sinon';
import {
  handleEvent,
  sendEvent,
  getNameEvents,
  clearEvents
} from '../../src/basic/event.js';

describe('Event Emitter Wrapper', () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = sinon.spy(console, 'error');
  });

  afterEach(() => {
    consoleSpy.restore();
    clearEvents();
  });

  describe('getNameEvents Test', () => {
    it('should be successfully get event names', () => {
      handleEvent('testEvent');
      expect(getNameEvents()).to.have.length(1);
    });
  });

  describe('clearEvents Test', () => {
    it('should be successfully clear event', () => {
      handleEvent('testEvent');
      clearEvents();
      expect(getNameEvents()).to.have.length(0);
    });
  });

  describe('handleEvent Test', () => {
    it('should add an event listener when given valid arguments', () => {
      const callback = () => {};
      handleEvent('testEvent', callback);
      expect(getNameEvents()).to.have.length(1);
    });

    it('should successfully with name event not string', () => {
      handleEvent(123, () => {});
      expect(getNameEvents()).to.have.length(1);
    });

    it('should log an error when given invalid callback type', () => {
      handleEvent('testEvent', 'not a function');
      expect(consoleSpy.calledOnce).to.be.true;
      expect(consoleSpy.args[0][0]).to.include('Error handle event');
    });
  });

  describe('sendEvent Test', () => {
    it('should emit an event with arguments', (done) => {
      const eventName = 'testEvent';
      const eventData = { foo: 'bar' };

      handleEvent(eventName, (data) => {
        expect(data).to.deep.equal(eventData);
        done();
      });

      sendEvent(eventName, eventData);
    });

    it('should log an error when given invalid nameEvent type', () => {
      sendEvent(123);
      expect(getNameEvents()).to.have.length(0);
    });

    it('should emit an event without arguments', (done) => {
      const eventName = 'noArgsEvent';

      handleEvent(eventName, () => {
        done();
      });

      sendEvent(eventName);
    });
  });
});
