import { useContext, useEffect, useRef, useState } from 'react';
import * as React from 'react';
import DJClientContext from '../../providers/djclient';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { displayMessageAfterSubmit, labelize } from '../../../utils/form';
import { ConfigField } from './MaterializationConfigField';
import LoadingIcon from '../../icons/LoadingIcon';

export default function AddMaterializationPopover({ node, onSubmit }) {
  const djClient = useContext(DJClientContext).DataJunctionAPI;
  const [popoverAnchor, setPopoverAnchor] = useState(false);
  const [options, setOptions] = useState([]);
  const [jobs, setJobs] = useState([]);

  const timePartitionColumns = node.columns.filter(col => col.partition);

  const ref = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const options = await djClient.materializationInfo();
      setOptions(options);
      const allowedJobs = options.job_types?.filter(job =>
        job.allowed_node_types.includes(node.type),
      );
      setJobs(allowedJobs);
    };
    fetchData().catch(console.error);
    const handleClickOutside = event => {
      if (ref.current && !ref.current.contains(event.target)) {
        setPopoverAnchor(false);
      }
    };
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [djClient, setPopoverAnchor]);

  const materialize = async (values, setStatus) => {
    const config = {};
    config.spark = values.spark_config;
    config.lookback_window = values.lookback_window;
    if (!values.job_type) {
      values.job_type = 'spark_sql';
    }
    const { status, json } =
      values.job_type === 'druid_cube'
        ? await djClient.materializeCube(
            values.node,
            values.job_type,
            values.strategy,
            values.schedule,
            values.lookback_window,
          )
        : await djClient.materialize(
            values.node,
            values.job_type,
            values.strategy,
            values.schedule,
            config,
          );
    if (status === 200 || status === 201) {
      setStatus({ success: json.message });
      window.location.reload();
    } else {
      setStatus({
        failure: `${json.message}`,
      });
    }
  };

  const configureMaterialization = async (
    values,
    { setSubmitting, setStatus },
  ) => {
    await materialize(values, setStatus).then(_ => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      setSubmitting(false);
    });
  };

  return (
    <>
      <button
        className="edit_button"
        aria-label="AddMaterialization"
        tabIndex="0"
        onClick={() => {
          setPopoverAnchor(!popoverAnchor);
        }}
      >
        <span className="add_node">+ Add Materialization</span>
      </button>
      <div
        className="fade modal-backdrop in"
        style={{ display: popoverAnchor === false ? 'none' : 'block' }}
      ></div>
      <div
        className="centerPopover"
        role="dialog"
        aria-label="client-code"
        style={{
          display: popoverAnchor === false ? 'none' : 'block',
          width: '50%',
        }}
        ref={ref}
      >
        <Formik
          initialValues={{
            node: node?.name,
            job_type: node?.type === 'cube' ? 'druid_cube' : 'spark_sql',
            strategy:
              timePartitionColumns.length == 1 ? 'incremental_time' : 'full',
            schedule: '@daily',
            lookback_window: '1 DAY',
            spark_config: {
              'spark.executor.memory': '16g',
              'spark.memory.fraction': '0.3',
            },
          }}
          onSubmit={configureMaterialization}
        >
          {function Render({ isSubmitting, status, setFieldValue }) {
            return (
              <Form>
                <h2>Configure Materialization</h2>
                {displayMessageAfterSubmit(status)}
                {node.type === 'cube' ? (
                  <span data-testid="job-type">
                    <label htmlFor="job_type">Job Type</label>

                    <Field as="select" name="job_type">
                      <>
                        <option key={'druid_cube'} value={'druid_cube'}>
                          Druid
                        </option>
                      </>
                    </Field>
                    <br />
                    <br />
                  </span>
                ) : (
                  ''
                )}
                <input
                  hidden={true}
                  name="node"
                  value={node?.name}
                  readOnly={true}
                />
                <span data-testid="edit-partition">
                  <label htmlFor="strategy">Strategy</label>
                  <Field as="select" name="strategy" id="strategy">
                    <>
                      <option key={'full'} value={'full'}>
                        Full
                      </option>
                      <option
                        key={'incremental_time'}
                        value={'incremental_time'}
                      >
                        Incremental Time
                      </option>
                    </>
                  </Field>
                </span>
                <br />
                <br />
                <label htmlFor="schedule">Schedule</label>
                <Field
                  type="text"
                  name="schedule"
                  id="schedule"
                  placeholder="Cron"
                  default="@daily"
                />
                <br />
                <br />
                <div className="DescriptionInput">
                  <ErrorMessage name="description" component="span" />
                  <label htmlFor="lookback_window">Lookback Window</label>
                  <Field
                    type="text"
                    name="lookback_window"
                    id="lookback_window"
                    placeholder="1 DAY"
                    default="1 DAY"
                  />
                </div>
                <br />
                <ConfigField
                  value={{
                    'spark.executor.memory': '16g',
                    'spark.memory.fraction': '0.3',
                  }}
                />
                <button
                  className="add_node"
                  type="submit"
                  aria-label="SaveEditColumn"
                  aria-hidden="false"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <LoadingIcon /> : 'Save'}
                </button>
              </Form>
            );
          }}
        </Formik>
      </div>
    </>
  );
}
