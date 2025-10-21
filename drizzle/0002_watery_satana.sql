ALTER TABLE `domains` ADD `userId` varchar(64);--> statement-breakpoint
ALTER TABLE `domains` ADD `userEmail` varchar(320);--> statement-breakpoint
ALTER TABLE `domains` ADD `ipAddress` varchar(45);--> statement-breakpoint
ALTER TABLE `domains` ADD `userAgent` text;--> statement-breakpoint
ALTER TABLE `domains` ADD `referrer` text;--> statement-breakpoint
ALTER TABLE `domains` ADD `scanCount` varchar(10) DEFAULT '1';--> statement-breakpoint
ALTER TABLE `domains` ADD `checkoutInitiatedAt` timestamp;--> statement-breakpoint
ALTER TABLE `domains` ADD `paidAt` timestamp;