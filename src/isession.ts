// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
'use strict';

import {
  IDisposable
} from 'phosphor-disposable';

import {
  ISignal, Signal
} from 'phosphor-signaling';

import {
  IKernel, IKernelId, KernelStatus
} from './ikernel';

import {
  IAjaxSettings
} from 'jupyter-js-utils';


/**
 * Notebook Identification specification.
 */
export
interface INotebookId {

  /**
   * The full path to the notebook file.
   */
  path: string;
}


/**
 * Session Identification specification.
 */
export
interface ISessionId {

  /**
   * The unique identifier for the session client.
   */
  id: string;
  notebook: INotebookId;
  kernel: IKernelId;
}


/**
 * Session initialization options.
 */
export
interface ISessionOptions {

  /**
   * The path (not including name) to the notebook.
   */
  notebookPath?: string;

  /**
   * The type of kernel (e.g. python3).
   */
  kernelName?: string;

  /**
   * The root url of the notebook server.
   */
  baseUrl?: string;

  /**
   * The url to access websockets.
   */
  wsUrl?: string;

  /**
   * The username of the session client.
   */
  username?: string;

  /**
   * The unique identifier for the session client.
   */
  clientId?: string;

  /**
   * The default ajax settings to use for the session.
   */
  ajaxSettings?: IAjaxSettings;
}


/**
 * Object which manages notebook session instances.
 */
export
interface INotebookSessionManager {
  /*
   * Get the running sessions.
   */
  listRunning(options?: ISessionOptions): Promise<ISessionId[]>;

  /**
   * Start a new session.
   */
  startNew(options: ISessionOptions): Promise<INotebookSession>;

  /**
   * Connect to a running notebook session.
   */
  connectTo(id: string, options?: ISessionOptions): Promise<INotebookSession>;
}


/**
 * Interface of a notebook session object.
 */
export
interface INotebookSession extends IDisposable {
  /**
   * A signal emitted when the session dies.
   */
  sessionDied: ISignal<INotebookSession, void>;

  /**
   * Unique id of the session.
   *
   * #### Notes
   * This is a read-only property.
   */
  id: string;

  /**
   * The path to the notebook.
   *
   * #### Notes
   * This is a read-only property.
   */
  notebookPath: string;

  /**
   * The kernel.
   *
   * #### Notes
   * This is a read-only property.
   */
  kernel: IKernel;

  /**
   * The current status of the session.
   *
   * #### Notes
   * This is a read-only property, and is a delegate to the kernel status.
   */
  status: KernelStatus;

  /**
   * Rename or move a notebook.
   *
   * @param path - The new notebook path.
   *
   * #### Notes
   * This uses the Notebook REST API, and the response is validated.
   * The promise is fulfilled on a valid response and rejected otherwise.
   */
  renameNotebook(path: string, ajaxSettings?: IAjaxSettings): Promise<void>;

  /**
   * Kill the kernel and shutdown the session.
   *
   * #### Notes
   * This uses the Notebook REST API, and the response is validated.
   * The promise is fulfilled on a valid response and rejected otherwise.
   */
  shutdown(ajaxSettings?: IAjaxSettings): Promise<void>;

  /**
   * Optional default settings for ajax requests, if applicable.
   */
  ajaxSettings?: IAjaxSettings;
}
