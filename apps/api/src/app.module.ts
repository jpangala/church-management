import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env"],
    }),
    PrismaModule,
    AuthModule,
    // Future modules: UsersModule, DivisionsModule, MembersModule,
    // ProjectsModule, RoomsModule, ItemsModule, BookingsModule,
    // FinanceModule, LandingModule, AuditLogModule
  ],
})
export class AppModule {}
