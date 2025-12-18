# 🗄️ PostgreSQL Database "ims" - CREDENTIALS

## ✅ DATABASE SUCCESSFULLY CREATED!

---

## 🔐 Database Credentials

### **Connection Information:**
```
Database Name: ims
Host: localhost
Port: 5432
Username: postgres
Password: admin@123
```

### **Connection String:**
```
postgresql://postgres:admin%40123@localhost:5432/ims
```
**Note:** `@` is URL-encoded as `%40`

### **.env File:**
```env
DATABASE_URL="postgresql://postgres:admin%40123@localhost:5432/ims"
```

---

## 📊 Database Tables Created

✅ **Department** - Department management  
✅ **Question** - Question bank  
✅ **Campaign** - Interview campaigns  
✅ **Candidate** - Candidate information  
✅ **User** - System users (for future auth)

---

## 🔗 Database Access

### **Using psql:**
```powershell
# Set password environment variable
$env:PGPASSWORD="admin@123"

# Connect to database
psql -U postgres -d ims

# Inside psql:
\dt                    # List all tables
\d "Department"        # Describe Department table
SELECT * FROM "Department";  # Query data
\q                     # Quit
```

### **Using pgAdmin:**
```
1. Open pgAdmin
2. Create new server connection:
   - Name: IMS Local
   - Host: localhost
   - Port: 5432
   - Database: ims
   - Username: postgres
   - Password: admin@123
```

### **Using Prisma Studio:**
```powershell
npx prisma studio
```
Opens at: http://localhost:5555

---

## 📋 Quick Commands

### **View All Tables:**
```powershell
$env:PGPASSWORD="admin@123"; psql -U postgres -d ims -c "\dt"
```

### **Count Records:**
```powershell
$env:PGPASSWORD="admin@123"; psql -U postgres -d ims -c "SELECT 
  (SELECT COUNT(*) FROM \"Department\") as departments,
  (SELECT COUNT(*) FROM \"Question\") as questions,
  (SELECT COUNT(*) FROM \"Campaign\") as campaigns,
  (SELECT COUNT(*) FROM \"Candidate\") as candidates;"
```

### **Backup Database:**
```powershell
$env:PGPASSWORD="admin@123"
pg_dump -U postgres -d ims -F c -f ims_backup.dump
```

### **Restore Database:**
```powershell
$env:PGPASSWORD="admin@123"
pg_restore -U postgres -d ims ims_backup.dump
```

---

## 🚀 Next Steps

### **1. Migrate Data from localStorage**
Visit: http://localhost:3000/admin/migrate
- Click "Start Migration"
- Moves all localStorage data to PostgreSQL

### **2. View Data in Prisma Studio**
```powershell
npx prisma studio
```
Opens GUI at http://localhost:5555

### **3. Test API Endpoints**
All API routes are ready:
- GET/POST `/api/departments`
- GET/POST `/api/questions`
- GET/POST `/api/campaigns`
- GET/POST `/api/candidates`

---

## ✅ Summary

**✅ Database:** ims (created)  
**✅ Tables:** 5 tables created  
**✅ Connection:** Working  
**✅ Prisma Client:** Generated  
**✅ API Routes:** Ready  

**Database Type:** PostgreSQL 18  
**Location:** Local server (same as CSAT project)  
**Schema:** public  

---

## 🔒 Security Note

**Production Recommendation:**
- Change password to something more secure
- Create application-specific user (not postgres superuser)
- Use environment variables (never commit .env)
- Enable SSL connections

**Create App User (Optional):**
```sql
CREATE USER ims_app WITH PASSWORD 'secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE ims TO ims_app;
GRANT ALL ON ALL TABLES IN SCHEMA public TO ims_app;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO ims_app;
```

---

**Your PostgreSQL "ims" database is ready to use!** 🎉

