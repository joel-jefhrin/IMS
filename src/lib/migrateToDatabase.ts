// Migration script to move data from localStorage to database
export async function migrateLocalStorageToDatabase() {
  try {
    // Get data from localStorage
    const localData = localStorage.getItem('interview-system-data');
    if (!localData) {
      console.log('No localStorage data to migrate');
      return { success: true, message: 'No data to migrate' };
    }

    const data = JSON.parse(localData);
    const { departments, questions, campaigns, candidates } = data.state || data;

    let migrated = {
      departments: 0,
      questions: 0,
      campaigns: 0,
      candidates: 0,
    };

    // Migrate departments
    if (departments && departments.length > 0) {
      for (const dept of departments) {
        try {
          await fetch('/api/departments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: dept.id,
              name: dept.name,
              description: dept.description || '',
            }),
          });
          migrated.departments++;
        } catch (error) {
          console.error('Error migrating department:', dept.id, error);
        }
      }
    }

    // Migrate questions
    if (questions && questions.length > 0) {
      for (const question of questions) {
        try {
          await fetch('/api/questions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(question),
          });
          migrated.questions++;
        } catch (error) {
          console.error('Error migrating question:', question.id, error);
        }
      }
    }

    // Migrate campaigns
    if (campaigns && campaigns.length > 0) {
      for (const campaign of campaigns) {
        try {
          await fetch('/api/campaigns', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(campaign),
          });
          migrated.campaigns++;
        } catch (error) {
          console.error('Error migrating campaign:', campaign.id, error);
        }
      }
    }

    // Migrate candidates
    if (candidates && candidates.length > 0) {
      for (const candidate of candidates) {
        try {
          await fetch('/api/candidates', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(candidate),
          });
          migrated.candidates++;
        } catch (error) {
          console.error('Error migrating candidate:', candidate.id, error);
        }
      }
    }

    console.log('Migration completed:', migrated);
    return {
      success: true,
      message: `Migrated ${migrated.departments} departments, ${migrated.questions} questions, ${migrated.campaigns} campaigns, ${migrated.candidates} candidates`,
      migrated,
    };
  } catch (error) {
    console.error('Migration error:', error);
    return {
      success: false,
      message: 'Migration failed: ' + (error as Error).message,
    };
  }
}

