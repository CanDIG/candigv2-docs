---
title: Backing up and restoring CanDIG data
description: Guide to backing up and restoring data stored in CanDIG
---

There are three kinds of data stored in CanDIG that we recommend backing up regularly.

1. Clinical and Genomic metadata stored in CanDIGs's postgres databases
2. Authorization data stored in vault that details user's authorization to access/edit ingested data
3. Logs

For data types 1 and 2, we recommend taking back ups after each ingest event and to store one or more copies of your backups on a separate secure server from your CanDIG installation. We also recommend encrypting your backup so that it cannot be accessed by an unauthorizaed user.

Logs can be backed up on a regular schedule and at a minimum, should be saved elsewhere when performing a rebuild of the stack.

## Backing up postgres databases

Backups of the postgres databases can be created by running the `make backup-all-postgres` command. These will be created in the location specified by the value `BACKUP_LOCATION` in your `.env` file.

```bash
make backup-all-postgres
```

You should copy these from `$BACKUP_LOCATION` to a secure location and consider encrypting them or otherwise ensuring that unauthorized users will not have access to the information.

## Restoring postgres databases

You can restore the postgres databases using make commands as well. However, because the files in question can be very large and because overwriting the existing data can be very consequential, we have implemented a slightly more complex procedure.

There are currently four CanDIG modules that use postgres databases; these can be found in the `CANDIG_DB_MODULES` value in your `.env` file. They correspond to the following locations in your CanDIGv2 repo:

| Module | Database name | Directory location |
| ------ | ------------- | ------------------ |
| drs    | drs           | lib/drs            |
| htsget | genomic       | lib/htsget         |
| katsu  | clinical      | lib/katsu          |
| rnaget | rnaget_db     | lib/rnaget         |

To restore each of these databases:

1.  The backup file to be restored must be de-encrypted and expanded into a `.sql` file.
2.  Create a file called `restore.txt` in the module's directory location, e.g. `lib/drs/restore.txt`.
3.  The `restore.txt` file should contain the full path of the location of the backup file.

You can either run `make restore-postgres-<module>` to restore an individual database prepared in this way, or run `make restore-all-postgres` to restore all databases prepared in this way.

You should be able to see the restored data in the data portal.

:::tip
If restoring data after updating to a new version of the stack or microservice (particularly katsu), it is possible that the data that is restored back to the database will be invalid against the updated version. This may not be immediately obvious but will cause errors in the data portal attempts to retrieve data with invalid values. We don't currently have a great way for you to check if your data is valid against the latest stack but some options are:

- Pay attention to the [MoHCCN data model changes](https://www.marathonofhopecancercentres.ca/researcher-hub/policies-and-guidelines) and be aware if the data in your system is affected by any updates
- Retain the `map.json`s that were used for ingest and run them through the script [validate_coverage.py](https://github.com/CanDIG/clinical_ETL_code/blob/develop/src/clinical_etl/validate_coverage.py) to check for any new validation errors and warnings

Depending on your comfort levels, to update your data to be compatible with the running version of the stack, you may want to:

- Use SQL to update tables/values directly in the katsu postgresql database
- Search/Replace values or create scripts to update the `map.json`s to be compatible with the latest model and reingest the updated data
- Perform a full clinical_etl process by updating csvs and mapping template
  :::

## Backing up Secrets and Authorization data

Secrets and Authorization data in CanDIG are stored within Vault. These should be backed up regularly so that they can be restored should there be a system crash and before the CanDIG stack is rebuilt. To back up Vault, run the command:

```
make backup-vault
```

This command creates a tar ball at `tmp/vault/backup.tar.gz`. This should be saved into a secure location outside the server your CanDIG deployment is running. You may want to change the name of the backup to include the date and type of backup for future reference, e.g. `YYYY-MM-DD-vault-backup.tar.gz`

To restore the vault backup, copy the backup tarball into the vault directory in the CanDIG stack and rename it to `restore.tar.gz`:

```
cp /path/to/backup.tar.gz path/to/CanDIGv2/lib/vault/restore.tar.gz
```

Then run

```
make restore-vault
```

All previous secrets and authorizations should be restored to the stack. The tarball is renamed to `restored.tar.gz` and can be deleted.

## Backing up logs

Logs are stored in `tmp/logs`. The contents of this folder should be saved periodically.
